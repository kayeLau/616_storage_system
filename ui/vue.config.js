// const { defineConfig } = require('@vue/cli-service')
const isProd = process.env.NODE_ENV === 'production';
const productionGzipExtensions = ['js', 'css']

const vueConfig = {
  devServer: {
    proxy: {
      '/616/api': {
        target: 'http://127.0.0.1:3000',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/616/api': '/'
        }
      },
    },
  },
  transpileDependencies: [],
  configureWebpack: {
    plugins: []
  },
}

if (isProd) {
  console.log('启用gzip压缩')
  const CompressionWebpackPlugin = require('compression-webpack-plugin');
  vueConfig.configureWebpack.plugins.push(new CompressionWebpackPlugin({
    algorithm: 'gzip',
    test: new RegExp(
      '\\.(' + productionGzipExtensions.join('|') + ')$'
    ),
    threshold: 10240,
    minRatio: 0.8
  }))
}

module.exports = vueConfig
