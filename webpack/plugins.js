const path = require('path');
const webpack = require('webpack');
const _ExtractTextPlugin = require('extract-text-webpack-plugin');


const ExtractTextPlugin = new _ExtractTextPlugin({ 
    filename: 'css/bundle.css',
    allChunks: true,
});

const UglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    include: /\.js$/,
    minimize: true
});

const LoaderOptionsPlugin = new webpack.LoaderOptionsPlugin({
    minimize: true
});

const OccurrenceOrderPlugin = 
    new webpack.optimize.OccurrenceOrderPlugin();


module.exports = {
    ExtractTextPlugin: ExtractTextPlugin,
    UglifyJsPlugin: UglifyJsPlugin,
    LoaderOptionsPlugin: LoaderOptionsPlugin,
    OccurrenceOrderPlugin: OccurrenceOrderPlugin
};