const { resolve } = require('path');

const mode = process.env.MODE ?? 'csr:dev';

const webpackPath = (webpackMode) => {
  if (webpackMode === 'csr:dev') {
    return 'webpack.dev.js';
  } else if (webpackMode === 'csr:prod') {
    return 'webpack.prod.js';
  } else if (webpackMode === 'ssr:client') {
    return 'webpack.ssr.client.js';
  } else if (webpackMode === 'ssr:server') {
    return 'webpack.ssr.server.js';
  }
};

module.exports = require(resolve(__dirname, 'webpack', webpackPath(mode)));
