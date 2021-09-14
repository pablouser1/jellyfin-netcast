import device from './device'

export default class Api {
  host = ''
  emby = `Mediabrowser Client="Netcast", Device="${device.modelName}", DeviceId="${device.serialNumber}", Version="1.0.0"`

  /**
   * @param {string} endpoint
   */
  async _req (endpoint, method = 'GET', data = null) {
    // Headers
    const headers = {
      'Content-Type': 'application/json',
      'X-Emby-Authorization': this.emby
    }
    const res = await fetch(this.host + endpoint, {
      method,
      body: data ? JSON.stringify(data) : null,
      headers
    })
    if (res.ok) {
      if (res.status === 204) {
        return true
      } else {
        const resJson = await res.json()
        return resJson
      }
    }
    return false
  }

  async ping () {
    const res = await this._req('/System/Info/Public')
    if (res) {
      return true
    }
    return false
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async login (username, password) {
    const auth = await this._req('/Users/AuthenticateByName', 'POST', {
      'Username': username,
      'Pw': password
    })
    return {
      token: auth.AccessToken,
      id: auth.User.Id,
      name: auth.User.Name
    }
  }

  /**
   * @param {object} device
   */
  capabilities (device) {
    this._req('/Sessions/Capabilities/Full', 'POST', device)
  }

  async PlaybackInfo (item_id, mediasource_id, audio, subtitle, user_id) {
    const res = await this._req(`/Items/${item_id}/PlaybackInfo?UserId=${user_id}/MediaSourceId=${mediasource_id}&IsPlayback=true&AutoOpenLiveStream=true&AudioStreamIndex=${audio}&SubtitleStreamIndex=${subtitle}`)
    return res
  }

  setToken(token) {
    this.emby += `, Token="${token}"`
  }
}
