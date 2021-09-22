// Handles player state
import device from '../device'
import { api } from '../common'

export default class Player {
  // Item Id
  id = ''
  // Media source Id
  source_id = ''
  // Play method
  method = ''
  // Url
  url = ''
  // Current video state
  state = {
    "IsMuted": false,
    "IsPaused": false,
    "RepeatMode": "RepeatNone",
    "PlayMethod": '',
    "MediaSourceId": '',
    "CanSeek": true,
    "ItemId": ''
  }

  video = null

  intervals = {
    progress: 0,
    scrollbar: 0
  }

  getVideo () {
    return document.getElementById("video")
  }

  notifyPlaying () {
    api.playing(this.state)
  }

  notifyStop () {
    api.stopping(this.state)
  }

  processPlayState() {
    if (this.video.playState === 5) {
      this.stop()
    }
  }

  /**
   * @param {string} item_id
   * @param {string} mediasource_id
   * @param {number} audio
   * @param {number} subtitle
   * @param {string} user_id
   */
  async run (item_id, mediasource_id, audio, subtitle, user_id) {
    this.video = this.getVideo()
    this.id = item_id
    const playback = await api.PlaybackInfo(
      this.id,
      mediasource_id,
      audio,
      subtitle,
      user_id
    );
    const mediaSource = playback.MediaSources[0]
    // Direct play (ideal)
    if (mediaSource.SupportsDirectPlay) {
      this.method = "DirectPlay"
      this.url = `${api.host}/Videos/${this.id}/stream.${mediaSource.Container}?static=true&mediaSourceId=${this.source_id}&deviceId=${device.serialNumber}&api_key=${api.token}&Tag=${mediaSource.ETag}`
    }
    // Direct stream
    else if (mediaSource.SupportsDirectStream) {
      // TODO
    }
    // Transcoding
    else {
      this.method = "Transcode";
      this.url = api.host + mediaSource.TranscodingUrl
    }

    this.state.PlayMethod = this.method
    this.state.MediaSourceId = this.source_id
    this.state.ItemId = this.id

    // Start video with available config
    this.notifyPlaying()
    this.video.width = mediaSource.Width
    this.video.height = mediaSource.Height
    this.video.data = this.url
    this.video.play()
    // Setup intervals
    this.video.onPlayStateChange = () => this.processPlayState
    // this.intervals.scrollbar = window.setInterval(() => this.updateProgressBar, 5000);
    // this.intervals.progress = window.setInterval(() => this.notifyProgress("TimeUpdate"), 10000)
  }

  stop () {
    this.notifyStop()
    this.video.onPlayStateChange = undefined
    this.video.stop()
  }
}
