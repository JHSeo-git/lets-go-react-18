const { resolve } = require('path');

const root = resolve(__dirname, '..');
const src = resolve(root, 'src');
const client = resolve(src, 'client');
const server = resolve(src, 'server');

module.exports = {
  root,
  src,
  client,
  server,
  clientPublicPathOrUrl: '/web/',
  nodeModules: resolve(root, 'node_modules'),
  dist: resolve(root, 'dist'),
  serverDist: resolve(root, 'dist-ssr'),
};
