const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const nodeExternals = require('webpack-node-externals');
const paths = require('./paths');

const development = process.env.NODE_ENV !== 'production';
const hotMiddlewareScript =
  'webpack-hot-middleware/client?name=web&reload=true';

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
  name: target,
  target,
  entry: entryPoints(target),
  output: {
    path: `${paths.serverDist}/${target}`,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: paths.clientPublicPathOrUrl,
  },
  devtool: 'source-map',
  optimization,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                noEmit: false,
                composite: false,
              },
            },
          },
        ],
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
          new MiniCssExtractPlugin(),
        ]
      : [
          new MiniCssExtractPlugin(),
          new webpack.HotModuleReplacementPlugin(),
          new WebpackManifestPlugin({
            fileName: 'asset-manifest.json',
            publicPath: paths.clientPublicPathOrUrl,
            generate: (seed, files, entrypoints) => {
              const manifestFiles = files.reduce((manifest, file) => {
                manifest[file.name] = file.path;
                return manifest;
              }, seed);
              const entrypointFiles = entrypoints.main.filter(
                (fileName) => !fileName.endsWith('.map')
              );

              return {
                files: manifestFiles,
                entrypoints: entrypointFiles,
              };
            },
          }),
        ],
  externals: target === 'node' ? [nodeExternals()] : undefined,
});

module.exports = [getConfig('web'), getConfig('node')];
