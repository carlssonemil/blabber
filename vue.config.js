module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/abstracts/variables.scss";
          @import "@/scss/abstracts/mixins.scss";
        `
      }
    }
  }
};