const { merge } = require('webpack-merge');
const base = require('./webpack.base.config');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    static: ['./dist'],
    hot: true,
  },
};

module.exports = merge(base, config);
