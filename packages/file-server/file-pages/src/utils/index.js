import { BackHost } from '../config'

export function getResourceUrl(fullPath) {
  return `//${location.hostname}:${BackHost.port}${fullPath.substr(1)}`
}