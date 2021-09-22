import device from './device'
import DEVICE_PROFILE from './helpers/DeviceProfile'

export default class Api {
  host = ''
  token = ''
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

  /**
   * @param {string} id
   */
  ImageUrl(id) {
    return `${this.host}/Items/${id}/Images/Primary`
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

  /**
   * @param {string} user_id
   */
  async library (user_id) {
    let items = []
    const res = await this._req(`/Users/${user_id}/Views`)
    res.Items.forEach((/** @type {{ Id: string; Name: string; CollectionType: string; }} */ element) => {
      let item = {
        id: element.Id,
        name: element.Name,
        img: this.ImageUrl(element.Id),
        url: ''
      }
      switch (element.CollectionType) {
        case 'movies':
          item.url = `#/movies/${element.Id}`
          break
        case 'tvshows':
          item.url = `#/tvshows/${element.Id}`
          break
      }
      items.push(item)
    })
    return items
  }

  /**
   * @param {string} user_id
   */
  async watching (user_id) {
    let items = []
    const res = await this._req(`/Users/${user_id}/Items/Resume?Limit=12&Recursive=true&Fields=PrimaryImageAspectRatio&MediaTypes=Video`)
    res.Items.forEach((/** @type {{ Id: string; Name: string; Type: string; }} */ element) => {
      let item = {
        id: element.Id,
        name: element.Name,
        img: this.ImageUrl(element.Id),
        url: ''
      }
      switch (element.Type) {
        case 'Movie':
          item.url = `#/player/${element.Id}`
          break
      }
      items.push(item)
    })
    return items
  }

  /**
   * @param {string} id
   * @param {string} user_id
   * @param {string} type
   */
  async collection (id, user_id, type) {
    let items = []
    const res = await this._req(`/Users/${user_id}/Items?SortBy=SortName,ProductionYear&SortOrder=Ascending&IncludeItemTypes=${type}&Recursive=true&ParentId=${id}`)
    res.Items.forEach((/** @type {{ Id: string; Name: string; Type: string }} */ element) => {
      let item = {
        id: element.Id,
        name: element.Name,
        img: this.ImageUrl(element.Id),
        url: ''
      }
      switch (element.Type) {
        case 'Movie':
          item.url = `#/details/${element.Id}`
          break
        case 'Series':
          item.url = `#/seasons/${element.Id}`
          break
      }
      items.push(item)
    })
    return items
  }

  /**
   * @param {string} id
   * @param {string} user_id
   */
  async seasons (id, user_id) {
    let items = []
    const res = await this._req(`/Shows/${id}/Seasons?userId=${user_id}&Fields=ItemCounts,PrimaryImageAspectRatio,BasicSyncInfo,CanDelete,MediaSourceCount`)
    res.Items.forEach((/** @type {{ Id: string; Name: string; }} */ element) => {
      items.push({
        id: element.Id,
        name: element.Name,
        img: this.ImageUrl(element.Id),
        url: `#/episodes/${element.Id}?show_id=${id}`
      })
    })
    return items
  }

  /**
   * @param {string} id
   * @param {string} show_id
   * @param {string} user_id
   */
   async episodes (id, show_id, user_id) {
    let items = []
    const res = await this._req(`/Shows/${show_id}/Episodes?SeasonId=${id}&UserId=${user_id}&Fields=ItemCounts%2CPrimaryImageAspectRatio%2CMediaSourceCount`)
    res.Items.forEach((/** @type {{ Id: string; Name: string; }} */ element) => {
      items.push({
        id: element.Id,
        name: element.Name,
        img: this.ImageUrl(element.Id),
        url: `#/details/${element.Id}`
      })
    })
    return items
  }

  /**
   * @param {string} item_id
   * @param {string} mediasource_id
   * @param {number} audio
   * @param {number} subtitle
   * @param {string} user_id
   */
  async PlaybackInfo (item_id, mediasource_id, audio, subtitle, user_id) {
    const res = await this._req(
      `/Items/${item_id}/PlaybackInfo?UserId=${user_id}/MediaSourceId=${mediasource_id}&IsPlayback=true&AutoOpenLiveStream=true&AudioStreamIndex=${audio}&SubtitleStreamIndex=${subtitle}`,
      "POST",
      DEVICE_PROFILE
    )
    return res
  }

  playing (state) {
    this._req('/Sessions/Playing', 'POST', state)
  }

  stopping (state) {
    this._req('/Sessions/Playing/Stopped', 'POST', state)
  }

  /**
   * @param {string} token
   */
  setToken(token) {
    this.token = token
    this.emby += `, Token="${token}"`
  }
}
