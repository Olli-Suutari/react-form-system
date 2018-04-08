const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  context: resolve(__dirname, 'src'),
  entry: ['babel-polyfill', './index.jsx'],
  output: {
      filename: 'public/javascripts/build-prod.js',
      path: resolve(__dirname),
      publicPath: '/',
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|public\/)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
          fallback: 'style-loader',
        }),
      },
        {
            test: /.(jpe?g|gif|png|svg)$/i,
            use: 'url-loader?limit=15000000',
        },
        {
            test: /\.(ttf|woff|woff2)$/,
            use: 'file-loader?name=public/fonts/[name].[ext]'
        },
    ],
  },

  plugins: [
    new UglifyJsPlugin({
        sourceMap: true
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('public/stylesheets/style-prod.css'),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/
    })
  ],
};
