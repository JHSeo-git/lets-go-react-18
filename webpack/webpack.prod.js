const { merge } = require('webpack-merge');
const base = require('./webpack.base');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

module.exports = merge(base, config);
