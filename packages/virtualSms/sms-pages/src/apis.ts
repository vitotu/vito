import axios from "axios";
import { HOST_CONFIG } from "./config";

export async function listenMainPages(wsId: string) {
  let [res, err] = await axios.get(`${HOST_CONFIG.apiPrefix}?wsId=${wsId}`).then(r => [r, null], e => [null, e])
  if(err) throw new Error('listenMainPages error', err)
  return res
}