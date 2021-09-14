// Handles player state
import { api } from '../common'
import { user } from '../store'

export default class Player {
  getVideo () {
    return document.getElementById("video")
  }

  /**
   * @param {string} item_id
   * @param {string} mediasource_id
   * @param {number} audio
   * @param {number} subtitle
   */
  async run (item_id, mediasource_id, audio, subtitle) {
    // @ts-ignore
    const playback = await api.PlaybackInfo(item_id, mediasource_id, audio, subtitle, $user.id)
    const mediaSource = playback.MediaSources[0]
    // TODO, get data to start video
  }
}
