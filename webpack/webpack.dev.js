const { merge } = require('webpack-merge');
const base = require('./webpack.base');
const Webpackbar = require('webpackbar');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  stats: 'errors-only',
  devServer: {
    historyApiFallback: true,
    static: ['./dist'],
    hot: true,
  },
  plugins: [new Webpackbar({ name: 'client', color: 'orange' })],
};

module.exports = merge(base, config);
