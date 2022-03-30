const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageJson = require('./package.json');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  entry: packageJson.source,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chinkhash].bundle.js',
    clean: true,
  },
  optimization: {
    // runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

module.exports = config;
