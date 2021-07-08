module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/abstracts/variables.scss";
          @import "@/scss/abstracts/mixins.scss";
        `
      }
    }
  }
};