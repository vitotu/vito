import axios from "axios";
import { useConfig } from "./config";
const HOST_CONFIG = useConfig()
export async function listenMainPages(wsId: string) {
  let [res, err] = await axios.get(`${HOST_CONFIG.getApiPrefix()}?wsId=${wsId}`).then(r => [r, null], e => [null, e])
  if(err) throw new Error('listenMainPages error', err)
  if(res.status == 200) {
    return res.data
  }
  return {}
}

export async function listenByNumbers(numbers: string[], wsIds: string[]) {
  if(numbers.length < 1) return {}
  let [res, err] = await axios.get(`${HOST_CONFIG.getApiPrefix()}/listenNumber?numbers=${numbers.join(',')}&wsIds=${wsIds.join(',')}`).then(r => [r, null], e => [null, e])
  if(err) throw new Error('listenByNumber error', err)
  if(res.status == 200) {
    return res.data
  }
  return {}
}

export async function stopTaskByIds(taskIds: string[]) {
  if(taskIds.length < 1) return {}
  let [res, err] = await axios.get(`${HOST_CONFIG.getApiPrefix()}/stop?taskIds=${taskIds.join(',')}`).then(r => [r, null], e => [null, e])
  if(err) throw new Error('stop task error: ', err)
  if(res.status == 200) {
    return res.data
  }
  return {}
}