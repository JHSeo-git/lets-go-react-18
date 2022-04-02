const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
const LoadblePlugin = require('@loadable/webpack-plugin');
const paths = require('./paths');

const development = process.env.NODE_ENV !== 'production';
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

const entryPoints = (target) => {
  if (target === 'node') {
    return ['./src/App.tsx'];
  }
  return development
    ? [hotMiddlewareScript, './src/server/index.tsx']
    : ['./src/server/index.tsx'];
};

const optimization = development
  ? {}
  : {
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
    };

/**
 * @type {import('webpack').Configuration}
 */
const getConfig = (target) => ({
  mode: development ? 'development' : 'production',
  target,
  entry: entryPoints(target),
  output: {
    path: `${paths.serverDist}/${target}`,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/web/',
  },
  devtool: 'source-map',
  optimization,
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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins:
    target === 'node'
      ? [
          //
          new LoadblePlugin(),
          new MiniCssExtractPlugin(),
        ]
      : [
          new LoadblePlugin(),
          new webpack.HotModuleReplacementPlugin(),
          new MiniCssExtractPlugin(),
        ],
  externals:
    target === 'node' ? ['"@loadable/component"', nodeExternals()] : undefined,
});

module.exports = [getConfig('web'), getConfig('node')];
