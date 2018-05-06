const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');

module.exports = {
    entry: {
        main: path.resolve(__dirname, "src/assets/js/main.js")
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
        filename: 'assets/js/[name].[chunkhash].js',
        chunkFilename: 'assets/js/[name].[chunkhash].js'
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules\/(.*)\.js/,
                    name: 'vendor',
                    chunks: "all"
                }
            }
        }
    },
    module: {
        rules: [{
            test: /(\.jsx|\.js)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["es2015"]
                }
            },
            exclude: /node_modules/,
            include: '/src/'
        }, {
            test: /(\.css|\.scss|\.sass)$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }, {
            test: /\.(gif|jpg|png|ico)\??.*$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: '[name].[ext]',
                    publicPath: '/assets/img/',
                    outputPath: 'assets/img/'
                }
            }
        }, {
            test: /\.(mp4|m4v|webm|ogv)\??.*$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: '[name].[ext]',
                    publicPath: '/assets/video/',
                    outputPath: 'assets/video/'
                }
            }
        }, {
            test: /\.(svg|woff|otf|ttf|eot)\??.*$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: '[name].[ext]',
                    publicPath: '/assets/fonts/',
                    outputPath: 'assets/fonts/'
                }
            }
        }, {
            test: /\.(html)\??.*$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: '[name].[ext]',
                    publicPath: '/assets/tmpls/',
                    outputPath: 'assets/tmpls/'
                }
            },
            exclude: ['/src/index.html', '/src/assets/html'],
            include: '/src/assets/vendor/bootstrap-calendar/tmpls'
        }]
    },
    plugins: [
        //dist
        new HashedModuleIdsPlugin(),
        new CleanWebpackPlugin(["dist"], {
            root: '',
            verbose: true,
            dry: false
        }),
        // new CopyWebpackPlugin([{
        //     from: path.resolve(__dirname, "src/assets/img"),
        //     to: path.resolve(__dirname, "dist/assets/img")

        // }, {
        //     from: path.resolve(__dirname, "src/assets/media"),
        //     to: path.resolve(__dirname, "dist/assets/media")
        // }]),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].[chunkhash].min.css',
            chunkFilename: 'assets/css/[name].[chunkhash].css'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            hash: false,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })

    ]
};