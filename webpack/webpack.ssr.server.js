const nodeExternals = require('webpack-node-externals');
const paths = require('./paths');

const development = process.env.NODE_ENV !== 'production';

const optimization = development
  ? {}
  : {
      minimize: true,
    };

/**
 * @type {import('webpack').Configuration}
 */
const config = {
  target: 'node',
  mode: development ? 'development' : 'production',
  node: {
    __dirname: false,
  },
  entry: {
    server: './src/server/server.tsx',
  },
  output: {
    path: paths.serverDist,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  devtool: 'source-map',
  optimization,
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  externals: [nodeExternals()],
};

module.exports = config;
