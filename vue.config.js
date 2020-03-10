module.exports = {
    productionSourceMap: false,
    devServer: {
        host: '0.0.0.0',
        port: 8888,
        proxy: {
            '/api': {
                // target: 'http://192.168.25.129:3000'
                target: 'http://127.0.0.1:3000'
                // target: 'http://34.80.157.186:8089', // test
            }
        }
    }
}
