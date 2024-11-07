const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  publicPath: '/frontend/',  // Tells Vue to serve files from the '/frontend' route.
  
}
