// postcss.config.js

module.exports = {
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
};
