const webpack = require('webpack');
const path = require('path');
const config = require('config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

const entry = (file) => process.env.NODE_ENV === 'production' ?
  ['babel-polyfill', 'whatwg-fetch', path.resolve(__dirname, file)] :
  ['babel-polyfill', 'whatwg-fetch', hotMiddlewareScript, path.resolve(__dirname, file)];

module.exports = {
  devtool: 'inline-source-map',

  entry: {
    app: entry('client/entrypoints/app'),
  },

  resolve: {
    alias: {
      components: path.resolve(__dirname, 'client/components'),
      containers: path.resolve(__dirname, 'client/containers'),
      dux: path.resolve(__dirname, 'client/redux/ducks'),
      factories: path.resolve(__dirname, 'client/factories'),
      fragments: path.resolve(__dirname, 'client/fragments'),
      hocs: path.resolve(__dirname, 'client/hocs'),
      lib: path.resolve(__dirname, 'client/lib'),
      mutations: path.resolve(__dirname, 'client/mutations'),
      queries: path.resolve(__dirname, 'client/queries'),
      redux_utils: path.resolve(__dirname, 'client/redux'),
      test_provider: path.resolve(__dirname, 'client/test_provider'),
    },
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  },

  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'client'),
          path.resolve(__dirname, 'test'),
          path.resolve(__dirname, 'node_modules/css-loader'),
        ],
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-2'],
        },
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'client'),
        ],
        use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
          loader: 'css-loader',
          query: {
            localIdentName: '[path][name]__[local]--[hash:base64:5]',
            modules: true,
          }
        })),
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        exclude: /node_modules/,
        query: {
          limit: 10000,
          minetype: 'application/font-woff',
        },
      },
      {
        test: /\.(ttf|eot|svg|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /node_modules/,
        loader: 'file-loader',
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      ignoreOrder: true,
      allChunks: true
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({ 
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    process.env.NODE_ENV === 'production' ? new webpack.optimize.UglifyJsPlugin() : undefined,
    process.env.NODE_ENV === 'production' ? undefined : new webpack.HotModuleReplacementPlugin(),
  ].filter(plugin => !!plugin)
};
