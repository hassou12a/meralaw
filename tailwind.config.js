/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B4B',
          50: '#E8EDF5',
          100: '#C5D1E5',
          200: '#9FB1D0',
          300: '#7891BB',
          400: '#5271A6',
          500: '#0D1B4B',
          600: '#0A1629',
          700: '#071020',
          800: '#040917',
          900: '#01030E',
        },
        gold: {
          DEFAULT: '#C9A84C',
          50: '#FCF8E8',
          100: '#F7EFC5',
          200: '#F2E19D',
          300: '#EDD375',
          400: '#E8C54D',
          500: '#C9A84C',
          600: '#9E8239',
          700: '#745D2A',
          800: '#49391B',
          900: '#1F150B',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      direction: {
        rtl: 'rtl',
        ltr: 'ltr',
      },
    },
  },
  plugins: [],
}
