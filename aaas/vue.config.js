module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: "https://apim-we-micrard.azure-api.net"
  }
};
