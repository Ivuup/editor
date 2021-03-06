module.exports = {
  outputDir: "/build",
  pages: {
    index: {
      entry: "dev/main.js",
      template: "dev/index.html"
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": __dirname + "/src"
      }
    }
  },
  devServer: {
    disableHostCheck: true
  }
};
