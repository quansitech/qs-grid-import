const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'grid-import-bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'head',
            template: path.join(__dirname, 'src', 'index.ejs')
        }),
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin()
    ],
    optimization:{
        usedExports: false
    }
};