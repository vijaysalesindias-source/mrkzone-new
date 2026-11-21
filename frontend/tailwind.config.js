/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          navy: '#131921',
          blue: '#232f3e',
          lightBlue: '#37475a',
          yellow: '#febd69',
          orange: '#f08804',
          gold: '#ffd814',
          goldHover: '#f7ca00',
          buyNow: '#ffa41c',
          buyNowHover: '#fa8900',
          link: '#007185',
          linkHover: '#c7511f',
          bg: '#eaeded',
          border: '#d5d9d9',
          dealRed: '#cc0c39',
          priceRed: '#b12704',
          star: '#de7921'
        }
      },
      fontFamily: {
        sans: ['"Ember"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
