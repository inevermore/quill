const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('../package.json');

const bannerPack = new webpack.BannerPlugin({
  banner: [`Text Editor v${pkg.version}`].join('\n'),
  entryOnly: true,
});
const constantPack = new webpack.DefinePlugin({
  QUILL_VERSION: JSON.stringify(pkg.version),
});

const source = [
  'index.js',
  'core.js',
  'blots',
  'core',
  'formats',
  'modules',
  'test',
  'themes',
  'ui',
  'utils',
].map(file => {
  return path.resolve(__dirname, '..', file);
});

const jsRules = {
  test: /\.js$/,
  include: source,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: [
                  'last 2 Chrome major versions',
                  'last 2 Firefox major versions',
                  'last 2 Safari major versions',
                  'last 2 Edge major versions',
                  'last 2 iOS major versions',
                  'last 2 ChromeAndroid major versions',
                ],
              },
            },
          ],
        ],
      },
    },
  ],
};

const svgRules = {
  test: /\.svg$/,
  include: [path.resolve(__dirname, '../assets/icons')],
  use: [
    {
      loader: 'html-loader',
      options: {
        minimize: true,
      },
    },
  ],
};

const stylRules = {
  test: /\.styl$/,
  include: [path.resolve(__dirname, '../assets')],
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
};

const lessRules = {
  test: /\.less$/,
  include: [path.resolve(__dirname, '../assets')],
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
};

const tsRules = {
  test: /\.ts$/,
  use: [
    {
      loader: 'ts-loader',
      options: {
        compilerOptions: {
          declaration: false,
          module: 'es6',
          sourceMap: true,
          target: 'es6',
        },
        transpileOnly: true,
      },
    },
  ],
};

const baseConfig = {
  mode: 'development',
  context: path.resolve(__dirname, '..'),
  entry: {
    'text-editor.js': ['./index.js'],
    './handout/bundle.js': './dist/handout/demo.js',
    './tiku/bundle.js': './dist/tiku/demo.js',
    'text-editor': './assets/tk.styl',
    'unit.js': './test/unit.js',
    'yike-iframe': './assets/yike-iframe.less',
  },
  output: {
    filename: '[name]',
    library: 'TextEditor',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../dist/'),
  },
  resolve: {
    alias: {
      parchment: path.resolve(
        __dirname,
        '../node_modules/parchment/src/parchment',
      ),
    },
    extensions: ['.js', '.styl', '.less', '.ts'],
  },
  module: {
    rules: [jsRules, stylRules, lessRules, svgRules, tsRules],
    noParse: [
      /\/node_modules\/clone\/clone\.js$/,
      /\/node_modules\/eventemitter3\/index\.js$/,
      /\/node_modules\/extend\/index\.js$/,
    ],
  },
  plugins: [
    bannerPack,
    constantPack,
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    hot: false,
    port: process.env.npm_package_config_ports_webpack,
    stats: 'minimal',
    disableHostCheck: true,
  },
};

module.exports = env => {
  if (env && env.minimize) {
    const { devServer, ...prodConfig } = baseConfig;
    return {
      ...prodConfig,
      mode: 'production',
      entry: { 'text-editor.min.js': './text-editor.js' },
      devtool: 'source-map',
    };
  }
  if (env && env.coverage) {
    baseConfig.module.rules[0].use[0].options.plugins = ['istanbul'];
    return baseConfig;
  }
  return baseConfig;
};
