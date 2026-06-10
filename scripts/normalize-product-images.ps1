# ════════════════════════════════════════════════════════════════════
# Normaliza TODAS las fotos de producto al lienzo 2:3 (el aspect-[2/3]
# que usan las tarjetas, la vista rápida y el detalle de producto).
#
#   - Respeta la orientación EXIF (fotos de celular giradas) y la aplica
#     a los píxeles antes de medir.
#   - Si la proporción ya es ~2:3 (±1%), no toca el archivo.
#   - Si no, extiende el lienzo (NUNCA recorta) rellenando con el color
#     promedio del borde de ESA foto, para que el parche no se note.
#   - JPG se reescribe con calidad 92; PNG sin pérdida.
#
# Uso:   powershell -File scripts\normalize-product-images.ps1            (aplica)
#        powershell -File scripts\normalize-product-images.ps1 -DryRun    (solo reporta)
# ════════════════════════════════════════════════════════════════════
param(
  [string]$Root = "public\products",
  [switch]$DryRun
)

Add-Type -AssemblyName System.Drawing

$TARGET = 2 / 3        # ancho/alto objetivo
$TOL = 0.010           # tolerancia: ±1% se considera ya correcto

function Get-JpegEncoder {
  [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
}
$jpegCodec = Get-JpegEncoder
$jpegParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$jpegParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [long]92)

# Aplica la orientación EXIF a los píxeles (y la elimina del metadato).
function Fix-Orientation([System.Drawing.Image]$img) {
  $ORIENT = 0x0112
  if ($img.PropertyIdList -notcontains $ORIENT) { return $false }
  $o = $img.GetPropertyItem($ORIENT).Value[0]
  $flip = switch ($o) {
    2 { [System.Drawing.RotateFlipType]::RotateNoneFlipX }
    3 { [System.Drawing.RotateFlipType]::Rotate180FlipNone }
    4 { [System.Drawing.RotateFlipType]::Rotate180FlipX }
    5 { [System.Drawing.RotateFlipType]::Rotate90FlipX }
    6 { [System.Drawing.RotateFlipType]::Rotate90FlipNone }
    7 { [System.Drawing.RotateFlipType]::Rotate270FlipX }
    8 { [System.Drawing.RotateFlipType]::Rotate270FlipNone }
    default { $null }
  }
  if ($null -ne $flip) { $img.RotateFlip($flip) }
  $img.RemovePropertyItem($ORIENT) | Out-Null
  return ($null -ne $flip)
}

# Color promedio del borde (muestrea los 4 lados) — el "fondo de estudio" de la foto.
function Get-EdgeColor([System.Drawing.Bitmap]$bmp) {
  $w = $bmp.Width; $h = $bmp.Height
  $stepX = [Math]::Max(1, [int]($w / 40))
  $stepY = [Math]::Max(1, [int]($h / 40))
  $r = 0L; $g = 0L; $b = 0L; $n = 0
  for ($x = 0; $x -lt $w; $x += $stepX) {
    foreach ($y in 0, ($h - 1)) {
      $c = $bmp.GetPixel($x, $y); $r += $c.R; $g += $c.G; $b += $c.B; $n++
    }
  }
  for ($y = 0; $y -lt $h; $y += $stepY) {
    foreach ($x in 0, ($w - 1)) {
      $c = $bmp.GetPixel($x, $y); $r += $c.R; $g += $c.G; $b += $c.B; $n++
    }
  }
  [System.Drawing.Color]::FromArgb([int]($r / $n), [int]($g / $n), [int]($b / $n))
}

$files = Get-ChildItem $Root -Recurse -File |
  Where-Object { $_.Extension -match '^\.(jpe?g|png)$' }

$done = 0; $skipped = 0; $failed = @()
foreach ($f in $files) {
  try {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $img = [System.Drawing.Image]::FromStream($ms)
    $rotated = Fix-Orientation $img

    $w = $img.Width; $h = $img.Height
    $ratio = $w / $h
    if (-not $rotated -and [Math]::Abs($ratio - $TARGET) -le $TOL) {
      $img.Dispose(); $ms.Dispose(); $skipped++; continue
    }

    # Lienzo destino 2:3 que CONTIENE la imagen completa
    if ($ratio -lt $TARGET) { $newW = [int][Math]::Ceiling($h * $TARGET); $newH = $h }
    else                    { $newW = $w; $newH = [int][Math]::Ceiling($w / $TARGET) }

    $rel = $f.FullName.Substring((Get-Location).Path.Length + 1)
    if ($DryRun) {
      "{0}  {1}x{2} (r={3:N3}) -> {4}x{5}{6}" -f $rel, $w, $h, $ratio, $newW, $newH, $(if ($rotated) { ' [EXIF]' } else { '' })
      $img.Dispose(); $ms.Dispose(); $done++; continue
    }

    $bmp = New-Object System.Drawing.Bitmap($img)
    $edge = Get-EdgeColor $bmp

    $canvas = New-Object System.Drawing.Bitmap($newW, $newH, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $gfx = [System.Drawing.Graphics]::FromImage($canvas)
    $gfx.Clear($edge)
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.DrawImage($bmp, [int](($newW - $w) / 2), [int](($newH - $h) / 2), $w, $h)
    $gfx.Dispose()

    $tmp = "$($f.FullName).tmp"
    if ($f.Extension -match '^\.jpe?g$') { $canvas.Save($tmp, $jpegCodec, $jpegParams) }
    else { $canvas.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png) }

    $canvas.Dispose(); $bmp.Dispose(); $img.Dispose(); $ms.Dispose()
    Move-Item -Force $tmp $f.FullName
    $done++
    "OK  $rel  ${w}x${h} -> ${newW}x${newH}$(if ($rotated) { ' [EXIF corregida]' })"
  }
  catch {
    $failed += "$($f.FullName): $($_.Exception.Message)"
  }
}

""
"Normalizadas: $done · Ya correctas: $skipped · Fallidas: $($failed.Count)"
$failed | ForEach-Object { "FALLO  $_" }
