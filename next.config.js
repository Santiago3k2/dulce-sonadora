/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Sin el optimizador de Vercel: el plan Hobby agotó la cuota y las fotos
    // nuevas devolvían 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED).
    // Las fotos ya se suben comprimidas (JPG 2:3), así que se sirven tal cual.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trrjuwcpntbxecbrarrt.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
