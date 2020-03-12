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
    },
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                // options placed here will be merged with default configuration and passed to electron-builder
                "appId": "com.chat.app",
                "productName":"chat",//项目名，也是生成的安装文件名，即aDemo.exe
                "copyright":"Copyright © 2020",//版权信息
                "mac":{
                    "icon":"./icon.png",
                },
            }
        }
    }
}
