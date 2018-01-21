const config = require('./webpack.config.js');
const path = require('path');

const webpack = Object.assign({}, config);
webpack.module.rules.push({
  enforce: 'post',
  test: /.*.jsx|(^(?!.*spec).*.js)/,
  exclude: /(node_modules|test)/,
  loader: 'istanbul-instrumenter-loader'
});
delete webpack.entry;

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],

    client: {
      mocha: {
        ui: 'bdd-lazy-var/global',
        require: [require.resolve('bdd-lazy-var/global')]
      },
    },

    frameworks: ['mocha'],

    files: [
      'node_modules/whatwg-fetch/fetch.js',
      'node_modules/babel-polyfill/dist/polyfill.js',
      'client/test.js'
    ],

    reporters: ['mocha', 'coverage-istanbul'],

    coverageReporter: {
      dir: 'build/coverage/',
      reporters: [
        { type: 'html' },
        { type: 'text' },
        { type: 'text-summary' },
      ]
    },

    coverageIstanbulReporter: {
      fixWebpackSourcePaths: true,
      reports: ['html', 'text-summary' ],
      // the option below would be nice, but it doesn't work.
      // See http://bit.ly/2qMKkS5
      // includeAllSources: true,
    },

    mochaReporter: {
      showDiff: true,
    },

    preprocessors: {
      'client/test.js': ['webpack', 'sourcemap']
    },

    webpack: webpack,

    webpackMiddleware: {
      noInfo: true,
      stats: {
        chunks: false
      }
    },

    plugins: [
      require('karma-mocha'),
      require('karma-webpack'),
      require('karma-mocha-reporter'),
      require('karma-phantomjs-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-coverage-istanbul-reporter')
    ]

  });
};
