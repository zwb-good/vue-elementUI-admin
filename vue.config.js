/*
 * @Author: your name
 * @Date: 2020-07-01 11:28:41
 * @LastEditTime: 2020-07-18 16:40:00
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \my-project\vue.config.js
 */ 
module.exports = {
    devServer: {
        port: 8081,
        proxy: {
            //配置跨域
            '/devApi': {
                target: "http://127.0.0.1:8080/",
                changOrigin: true,
                pathRewrite: {
                    '^/devApi': ''
                }
            }
        }
    }
}