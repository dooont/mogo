/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.hbs'],
  theme: {
    extend: {
      fontFamily: {
        'for-titles': [
          'Jersey 25', 'sans-serif'
        ],
      },
      colors: {
        'pastel-purple': "#9A8FBC",
        'cream-white': '#FFFDD0',
        'nyu-purple': '#57068C',
      }
    },
  },
  plugins: [],
}

