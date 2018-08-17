const path = require('path');
const webpack = require('webpack');
const loaders = require('./webpack/loaders');
const plugins = require('./webpack/plugins');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        path.resolve(__dirname, 'dev') + '/js/script.js',
        path.resolve(__dirname, 'dev') + '/css/style.scss'
    ],
    module: {
        loaders: [
            loaders.JSLoader,
            loaders.CSSLoader
        ]
    },
    output: {
        path: path.resolve(__dirname, 'release'),
        filename: 'js/bundle.js'
    },
    plugins: [
        plugins.ExtractTextPlugin,
        plugins.LoaderOptionsPlugin,
        plugins.OccurrenceOrderPlugin
    ]
    //, watch: true
};