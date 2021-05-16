import ShowError from '../helpers/ShowError'
import store from '../store'
import { device, appVersion } from '../common'

// TODO, USE jellyfin-apiclient //

console.log(`Running version: ${appVersion}`)
const defaultParams = `Mediabrowser Client="Netcast", Device="${device.modelName}", DeviceId="${device.serialNumber}", Version="${appVersion}"`
const customHeaders = {
  'Content-Type': 'application/json',
  'X-Emby-Authorization': defaultParams
}

/**
 * Get JSON from server
 * @param {string} endpoint Request path
 * @param {string} type Request type (GET, POST, PUT, DELETE)
 * @param {string} data JSON-encoded data body (optional)
 */
const requests = async (endpoint, type, data = null) => {
  console.log(store.get('host'))
  const url = store.get('host') + endpoint
  try {
    const res = await fetch(url, {
      method: type,
      headers: customHeaders,
      body: data ? JSON.stringify(data) : null
    })
    const resJson = res.json()
    if (res.ok && resJson) {
      return resJson
    }
      ShowError.snack('Error (WIP: HANDLE ERROR)')
      return false

  } catch (badRes) {
    ShowError.snack('Error (WIP: HANDLE ERROR)')
    return false
  }
}

export const addToken = (token) => {
  customHeaders['X-Emby-Authorization'] += `, Token=" + ${token}`
}

export default requests
