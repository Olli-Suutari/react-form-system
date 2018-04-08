const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: resolve(__dirname, 'src'),
  entry: ['babel-polyfill', './index.jsx'],
  output: {
      filename: 'javascripts/build.js',
      path: '/',
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
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('stylesheets/style.css')
  ],
};

  if (process.env.NODE_ENV !== 'production') {
  module.exports.entry.unshift(
    'react-hot-loader/patch',
    'react-hot-loader/babel',
    'webpack-hot-middleware/client',
  );
  module.exports.plugins.unshift(new webpack.HotModuleReplacementPlugin());
}
