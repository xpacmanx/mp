module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('autoprefixer')(),
          require('tailwindcss')(), 
        ],
      },
      sass: {
        // additionalData: 
        //   @import "./src/scss/_variables.scss"
        additionalData: `@use "./src/scss/_variables" as *;`
      }
    }
  }
};