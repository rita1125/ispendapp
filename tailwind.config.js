/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ 
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}" ],
  theme: {  
      extend: {
        colors: {
          customBlue: '#1DA1F2',
        },
      }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  purge: {     //會使用到的內容寫在 purge 屬性內，就可以去監聽我哪支檔案有使用到，只會編譯使用的檔案
    enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  },
}

