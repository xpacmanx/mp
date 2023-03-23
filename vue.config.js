module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: 
          @import "./src/scss/_variables.scss";
      }
    }
  }
};