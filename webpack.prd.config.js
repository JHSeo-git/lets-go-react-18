const { merge } = require('webpack-merge');
const base = require('./webpack.base.config');

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'production',
};

module.exports = merge(base, config);
