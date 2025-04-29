/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        destructive: '#EB5146',
        primary: {
          '500': '#3B82F6',
          '600': '#2563EB',
          '700': '#1D4ED8',
          '2': '#101115',
          '3': '#2652B9',
          '800': '#0F4ABE',
        },
        neutral: {
          '50': '#F8FAFC',
          '100': '#F1F5F9',
          '200': '#E2E8F0',
          '600': '#475569',
          '700': '#334155',
          '900': '#0F172A',
        },
        gray: {
          '1': '#202939',
          '2': '#727688',
          'active-sidebar': 'rgba(255, 255, 255, 0.1)',
        },
        disabled: '#9BA0AE'
      },
      backgroundImage: {
        'search': "url('../assets/images/image.job.search.png')",
        'gradient-primary': 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}



