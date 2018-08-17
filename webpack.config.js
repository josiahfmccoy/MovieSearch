const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // scss to css

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        path.resolve(__dirname, 'dev') + '/js/script.js',
        path.resolve(__dirname, 'dev') + '/css/style.scss'
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'dev')
            },
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'release'),
        filename: 'js/bundle.js'
    },
    plugins: [
        new ExtractTextPlugin({ // define where to save the file
          filename: 'css/bundle.css',
          allChunks: true,
        }),
        new webpack.optimize.OccurrenceOrderPlugin()
    ]
    //, watch: true
};