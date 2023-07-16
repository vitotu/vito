# service

smsService 的后端服务， 提供预置模块的短信主页，及号码监听服务
客户端需同时使用ws监听路径：ws://localhost:3000/ws?id=1008
监听服务获得的数据将通过ws发送给客户端

## 接口文档

### 1. 开启主页监听

get http://localhost:3000 http/1.1

返回值示例：

```json
{
  "code": 200,
  "message": "任务启动成功",
  "id": "wyhIe1_0CFE0Hqknsr2_T"
}
```

### 2. 停止任务

get http://localhost:3000/stop?taskId=wyhIe1_0CFE0Hqknsr2_T http/1.1

返回值示例：

```json
{
  "code": 0,
}
```

get http://localhost:3000/stop?stopLoop=true http/1.1

停止所有任务

### 3. 开启制定号码短信监听

get http://localhost:3000/listenNumber?numbers=8522352158489 http/1.1

返回值示例：

```json
{
  "code": 200,
  "message": "任务启动成功",
  "id": "q-v3E1tmwOu-5Kgk_7Bds"
}
```
