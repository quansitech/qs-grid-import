const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf.js');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
        },
        port: 3001,
        before: function(app){
            app.use('/move',
                createProxyMiddleware({
                    target: "http://app.library.test/",
                    changeOrigin: true,
                })
            )
        }
    },

});