import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'

export default {
  input: './index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
  },
  plugins: [
    nodeResolve(), // 解析 node_modules 中的模块
    commonjs(), // 将 CommonJS 模块转换为 ES6 模块
    json(),
  ],
}