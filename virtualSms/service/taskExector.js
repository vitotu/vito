/**
 * @description: 任务执行器
 * @param {options}
 * TODO: 增加对任务总数的限制，并自动退出最早加入的任务
 */
const { nanoid } = require('nanoid')

exports.LoopTask =  class {
  constructor(options = {}) {
    this.timer = null;
    this.intervalTime = options.intervalTime || 5000;
    this.cb = {};
    this.ids = []; // 记录任务顺序
  }
  add(cb) {
    let id = nanoid()
    this.cb[id] = cb
    this.ids.push(id)
    return id
  }
  start() {
    this.timer = setInterval(async () => {
      for(const id of this.ids) {
        const cb = this.cb[id] // 防止在执行过程中被删除导致报错
        if(cb) {
          let [res, err] = await this.cb[id]().then(r => [r, null], e => [null, e])
          if(err) console.error(`[LoopTask ${id}] error: `, err)
        }
      }
    }, this.intervalTime)
    return this.timer
  }
  stop() {
    if(this.timer) clearInterval(this.timer)
    this.timer = null
  }
  removeById(id) {
    delete this.cb[id]
    this.ids = this.ids.filter(i => i != id)
  }
  get Status() {
    return Boolean(this.timer)
  }
  hasId(id){
    return this.cb[id]
  }
}
