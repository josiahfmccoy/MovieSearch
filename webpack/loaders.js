const path = require('path');
const plugins = require('./plugins');


const JSLoader = {
    test: /\.js$/,
    include: path.resolve(__dirname, '../dev')
};

const CSSLoader = {
    test: /\.s?css$/,
    use: plugins.ExtractTextPlugin.extract({
        use: [
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    importLoaders: 1
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    config: {
                        path: path.resolve(__dirname, './postcss.config.js')
                    }
                },
            },
        ],
    }),
};


module.exports = {
    JSLoader: JSLoader,
    CSSLoader: CSSLoader
};