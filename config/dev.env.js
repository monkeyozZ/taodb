'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://tdbtestapi.baojeah.cn/taodanbao"', // 测试环境
  BASE_API: '"http://192.168.2.105:80/taodanbao"', // 本地环境
  BASE_SHAREURL: '"http://tdbtest.baojeah.cn/taodb"' // 测试环境
})
