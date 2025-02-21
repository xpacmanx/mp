module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('autoprefixer')(),
          require('tailwindcss')(), 
        ],
      }
    }
  }
};