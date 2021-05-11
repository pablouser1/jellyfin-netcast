import requests, { addToken } from './api'
import Cookies from '../helpers/Cookies'
import store from '../store'

export default class Auth {
  static checkSession () {
    const tempSettings = Cookies.get('jellyfin-netcast')
    if (tempSettings) {
      console.log('Session found')
      const tempSettingsJSON = JSON.parse(tempSettings)
      store.set('host', tempSettingsJSON.host)
      store.set('user', {
        id: tempSettingsJSON.user.id,
        name: tempSettingsJSON.user.name,
        token: tempSettingsJSON.user.token
      })
      addToken(tempSettingsJSON.token)
      return true
    }
    console.log('Session not found')
    return false
  }

  static async checkHost () {
    const res = await requests('/System/Info/Public', 'GET')
    if (res) {
      return true
    }
    return false
  }

  static async login (username, password) {
    const res = await requests('/Users/AuthenticateByName', 'POST', {
      Username: username,
      Pw: password
    })
    if (res) {
      const cookie = {
        host: store.get('host'),
        user: {
          id: res.User.Id,
          name: res.User.Name,
          token: res.AccessToken
        }
      }
      Cookies.set('jellyfin-netcast', JSON.stringify(cookie), 30)
      addToken(res.Token)
    }
  }
}
