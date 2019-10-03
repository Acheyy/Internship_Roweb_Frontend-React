const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

/**
 * Extract Text Plugin Options
 *
 * @type {{publicPath: string}}
 */
const extractTextPluginOptions = {
    publicPath: Array(`css/[name].[contenthash:8].css`.split('/').length).join('../')
};

/**
 * Webpack config
 *
 * @param env
 *
 * @param options
 *
 @returns {{bail: boolean, devtool: , entry: string[], devServer: {overlay: boolean, historyApiFallback: boolean, https: boolean, port: number}, module: {rules: []}, plugins: [], output: {path: *, filename: string, chunkFilename: string, publicPath: string}}}
 */
module.exports = (env, options = {mode: 'production'}) => {
    return {
        bail: true,
        devtool: options.mode === 'production' ? 'source-map' : false,
        entry: [
            '@babel/polyfill',
            './src/index.js'
        ],
        devServer: {
            overlay: true,
            historyApiFallback: true,
            port: 9000,
            https: false,
            stats: {
                cached: false,
                cachedAssets: false,
                chunks: false,
                chunkModules: false,
                chunkOrigins: false,
                modules: false
            }
        },
        module: {
            rules: [
                {
                    oneOf: [
                        {
                            test: /\.(bmp|gif|jpe?g|png)$/,
                            loader: 'url-loader',
                            options: {
                                limit: 5000,
                                name: 'media/[name].[hash:8].[ext]'
                            }
                        },
                        {
                            test: /\.svg$/,
                            loader: 'file-loader',
                            options: {
                                name: 'media/[name].[hash:8].[ext]'
                            }
                        },
                        {
                            test: /\.jsx?$/,
                            exclude: /node_modules/,
                            loader: "babel-loader",
                            options: {
                                compact: options.mode === 'production'
                            }
                        },
                        {
                            test: /\.s?css$/,
                            loader: ExtractTextPlugin.extract(
                                Object.assign(
                                    {
                                        fallback: {
                                            loader: 'style-loader'
                                        },
                                        use: [
                                            {
                                                loader: 'css-loader',
                                                options: {
                                                    sourceMap: options.mode === 'production',
                                                    importLoaders: 1,
                                                    minimize: options.mode === 'production'
                                                }
                                            },
                                            {
                                                loader: 'postcss-loader',
                                                options: {
                                                    sourceMap: options.mode === 'production',
                                                    ident: 'postcss',
                                                    plugins: () => [
                                                        require('postcss-flexbugs-fixes'),
                                                        autoprefixer('last 2 versions')
                                                    ]
                                                }
                                            },
                                            {
                                                loader: "sass-loader",
                                                options: {
                                                    sourceMap: options.mode === 'production'
                                                }
                                            }
                                        ]
                                    },
                                    extractTextPluginOptions
                                )
                            )
                        },
                        {
                            test: /\.html$/,
                            use: [
                                {
                                    loader: "html-loader",
                                    options: {
                                        minimize: options.mode === 'production'
                                    }
                                }
                            ]
                        },
                        {
                            loader: 'file-loader',
                            exclude: [/\.jsx?$/, /\.s?css$/, /\.html$/, /\.json$/],
                            options: {
                                name: 'resources/[name].[hash:8].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            ... options.mode === 'production' ? [
                new CleanWebpackPlugin([
                    'public/resources',
                    'public/media',
                    'public/css',
                    'public/js',
                    'public/src',
                    'public/*.*'
                ], {
                    exclude: ['.htaccess']
                })] : [],
            new HtmlWebPackPlugin({
                title: 'React start up',
                favicon: 'src/favicon.ico',
                hash: true,
                template: './src/index.html',
                inject: true,
                sourceMap: options.mode === 'production',
                chunksSortMode: 'dependency',
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                }
            }),
            ... options.mode === 'production' ? [
                new UglifyJsPlugin({
                    cache: options.mode === 'production',
                    parallel: true,
                    sourceMap: options.mode === 'production'
                })] : [],
            new ExtractTextPlugin({
                filename: 'css/[name].[chunkhash:8].css'
            }),
            new ManifestPlugin({
                fileName: 'asset-manifest.json'
            }),
            new Dotenv({
                safe: true
            })
        ],
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: 'js/[name].[chunkhash:8].js',
            chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
            publicPath: '/'
        }
    };
};
