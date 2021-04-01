const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LessThemePlugin = require('./plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[chunkhash].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              "babelrc": false,
              plugins: [
                "syntax-dynamic-import",
                // "transform-object-rest-spread",
                "transform-class-properties",
                ['import', {
                  libraryName: 'antd',
                  style: true,
                }],
              ],
              presets: [["@babel/react",{module: false}], ['react-app', { typescript: true, module: false }]],
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: LessThemePlugin.loader,
          },
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              // javascriptEnabled: true,
              lessOptions: {
                compress: true,
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public/index.html'),
    }),
    new LessThemePlugin({
      variables: ['primary-color'],
      themes: [
        {
          name: 'dark',
          filename: require.resolve('antd/lib/style/themes/dark.less'),
        },
        {
          name: 'compact',
          filename: require.resolve('antd/lib/style/themes/compact.less'),
        },
        // {
        //   name: 'aliyun',
        //   filename: require.resolve('@ant-design/aliyun-theme/index.less'),
        // },
      ],
    }),
  ],
};
