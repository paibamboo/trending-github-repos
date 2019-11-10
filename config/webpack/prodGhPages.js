const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const prod = require('./prod');

module.exports = {
  ...prod,
  output: {
    path: path.resolve('./build/public'),
    publicPath: '/trending-github-repos/web/public/',
    filename: 'js/[name].[chunkhash].js'
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        tslint: {
          failOnHint: true
        },
      }
    }),
    new ManifestPlugin({
      fileName: '../manifest.json'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        GH_PAGES: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash].css'
    })
  ]
};
