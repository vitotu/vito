import axios from 'axios'

import configData from '../../../config.json'

const hostConfig = configData?.local

export async function getFilePath() {
  const result = await axios.get(`${hostConfig.host}:${hostConfig.port}/resource/dark-file.json`)
  if(result.status === 200) return result?.data || {}
  else return {}
}
