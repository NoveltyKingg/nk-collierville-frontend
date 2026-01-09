/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './page-components/**/*.{js,ts,jsx,tsx}',
    './node_modules/antd/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Yrsa', 'serif'],
      },
      colors: {
        main: '#38455e',
        footer: '#f3dbc3',
        footerText: '#341809',
      },
    },
  },
  plugins: [],
}

export default config
