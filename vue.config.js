const {defineConfig} = require('@vue/cli-service')
const path = require('path');
module.exports = {
    transpileDependencies: true,
    lintOnSave: false,
    configureWebpack: config => {
        // 如果需要添加 path-browserify 模块的 polyfill
        // config.resolve.fallback = {"path": require.resolve("path-browserify")};
        // config.resolve.fallback = {
        //     "fs": false  // 禁用对 fs 模块的引用
        // };
        if (process.env.NODE_ENV === 'development') {
            config.devServer = {
                proxy: {
                    '/api': {
                        target: 'http://localhost:8090/',
                        changeOrigin: true
                    }
                }
            };
        }
    },
    css: {
        loaderOptions: {
            postcss: {
                postcssOptions: {
                    plugins: {
                        'postcss-pxtorem': {
                            rootValue: 37.5,
                            unitPrecision: 3,
                            propList: ['*'],
                            exclude: /(node_module)/,
                            selectorBlackList: ['.van'],
                            mediaQuery: false,
                            minPixelValue: 1
                        }
                    }
                }
            }
        }
    }
};
