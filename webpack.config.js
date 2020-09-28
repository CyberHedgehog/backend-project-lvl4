const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  entry: ['./src/index.js'],
  output: {
    path: path.join(__dirname, 'dist', 'public'),
    filename: 'main.js',
    publicPath: '/public/assets/',
  },
  devServer: {
    host: 'localhost',
    port: 5001,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'popper.js': ['Popper', 'window.Popper'],
    }),
  ],
};
