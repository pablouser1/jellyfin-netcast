import { api, ws } from './common'
import { user } from './store'
import Cookies from './helpers/Cookies'
import DEVICE_CAPABILITIES from './helpers/DeviceProfile'

export default class Session {
  static check() {
    const session = Cookies.get('jellyfin-netcast')
    if (session) {
      console.log('Session found')
      const sessionJSON = JSON.parse(session)
      user.set({
        id: sessionJSON.id,
        name: sessionJSON.name
      })
      api.host = sessionJSON.host
      api.setToken(sessionJSON.token)
      Session.start(sessionJSON.host, sessionJSON.token)
      return true
    }
    console.log('Session not found')
    return false
  }

  /**
   * @param {string} host
   * @param {string} token
   * @param {string} id
   * @param {string} name
   */
  static set(host, token, id, name) {
    const payload = {
      host, token, id, name
    }
    Cookies.set('jellyfin-netcast', JSON.stringify(payload), 30)
  }

  /**
   * @param {string} host
   * @param {string} api_key
   */
  static start (host, api_key) {
    // Starting WebSocket
    const socketURL = host.replace(/(http)(s)?\:\/\//, "ws$2://")
    ws.start(socketURL, api_key)
    // Sending capabilities
    api.capabilities(DEVICE_CAPABILITIES)
  }
}
