import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pink-soft': '#FFC1D9',
        'pink-light': '#FFD6E5',
        'pink-dark': '#FF7AA8',
        'pink-deeper': '#E63E80',
        'pink-vivid': '#FF4D8A',
        'coral': '#FF8FA8',
        'rose-gold': '#FFB199',
        'gold-soft': '#FFC971',
        'cream': '#FFF5F8',
        'gray-soft': '#FAF5F7',
        'gray-line': '#EDE3E7',
        'text-dark': '#1F1F1F',
        'text-muted': '#7A6E73',
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #FF7AA8 0%, #E63E80 100%)',
        'gradient-pink-soft': 'linear-gradient(135deg, #FFD6E5 0%, #FFC1D9 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FFB199 0%, #FF7AA8 50%, #E63E80 100%)',
        'gradient-hero': 'linear-gradient(135deg, #FFF5F8 0%, #FFE5EF 50%, #FFD6E5 100%)',
      },
      boxShadow: {
        'pink': '0 10px 30px -10px rgba(230, 62, 128, 0.35)',
        'pink-soft': '0 6px 20px -6px rgba(255, 122, 168, 0.25)',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
        'splash-in': 'splashIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        splashIn: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
