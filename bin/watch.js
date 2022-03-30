#!/usr/bin/env node

const chokidar = require('chokidar');
const {exec} = require('child_process');
const path = require('path')
const buildFile =  path.join(__dirname, './build')
const Parser = require('../lib/parser/config.js');
const args = process.argv.slice(2);
const config = new Parser({config: args[0] || './release.conf'});
const {DIR_WEBROOT, DIR_OUTPUT, DIR_OUTPUT_TP, DIR_WATCH_IGNORE} = config._cache
let ignoreList = []
try {
  if (DIR_WATCH_IGNORE) {
    ignoreList = DIR_WATCH_IGNORE.split(',')
  }
  ignoreList = ignoreList.map(item => `${DIR_WEBROOT}${item}/**/*`)
}catch (err) {}
console.log(`watching file change ....`);
chokidar.watch([DIR_WEBROOT], {
  ignored: [
    ...ignoreList,
    `${DIR_OUTPUT}/**/*`,
    `${DIR_OUTPUT_TP}/**/*`
  ],
}).on('change', (file) => {
  if (file) {
    doBuild(file)
  }
})
const debounce = (fn, delay) => {
  let timer = null
  return function () {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay);
  }
}
const doBuild = debounce((file) => {
  console.log(`${file}文件发生更新`)
  let time = new Date().valueOf()
  const command = `node --max_old_space_size=8192 ${buildFile} ${args[0] || './release.conf'} watch`
  console.log('start build......')
  console.log(`exec ${command}`)
  exec(command, {maxBuffer: 1024 * 5000}, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      console.error(`stderr: ${stderr}`);
      return;
    }
    // console.log(`stdout: ${stdout}`);
    console.log('end--', `${new Date().valueOf() - time}ms`)
  })
}, 300)