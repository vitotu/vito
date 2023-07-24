# service

smsService 的后端服务， 提供预置模块的短信主页，及号码监听服务
客户端需同时使用ws监听路径：ws://localhost:3000/ws?id=1008
监听服务获得的数据将通过ws发送给客户端

## 接口文档

### 1. 开启主页监听

get http://localhost:3000?wsIds=1008 http/1.1

query入参：

wsIds： String类型， 需与ws通信id相同
key： String类型， 预置模块的key，非必传，默认为sms24模块

返回值示例：

```json
{
  "code": 200,
  "message": "任务启动成功",
  "id": "wyhIe1_0CFE0Hqknsr2_T"
}
```

### 2. 停止任务

get http://localhost:3000/stop?taskIds=wyhIe1_0CFE0Hqknsr2_T http/1.1

query入参：

  taskIds: 为任务id，多个任务id用逗号分隔
  stopLoop： Boolean类型，是否停止全部任务循环, 此参数为true时，taskIds参数无效

返回值示例：

```json
{
  "code": 0,
}
```

### 3. 开启指定号码短信监听

get http://localhost:3000/listenNumber?numbers=8522352158489 http/1.1

query入参：

numbers： String类型，需要监听的号码，多个号码用逗号分隔
wsIds： String类型， 需与ws通信id相同， 不传则为ws广播模式

返回值示例：

```json
{
  "code": 200,
  "message": "任务启动成功",
  "id": "q-v3E1tmwOu-5Kgk_7Bds"
}
```
