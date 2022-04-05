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
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
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
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportOnlyLocals: true,
              },
            },
          },
        ],
      },
    ],
  },
  externals: [nodeExternals()],
};

module.exports = config;
