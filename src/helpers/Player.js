// Handles player state
import device from '../device'
import { api } from '../common'
import { pop } from 'svelte-spa-router'

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

  progress = 0

  getVideo () {
    return document.getElementById("video")
  }

  notifyPlaying () {
    api.playing(this.state)
  }

  notifyStop () {
    api.stopping(this.state)
  }

  /**
   * @param {string} reason
   */
  notifyProgress (reason) {
    const state = this.state
    state.EventName = reason
    if (this.video.speed === 0) {
      state.IsPaused = true
    }
    // Convert from ms to ticks
    const current_ticks = this.video.playPosition * 1e4
    // Set
    state.PositionTicks = current_ticks
    api.progress(state)
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
      this.method = "DirectStream"
      this.url = `${api.host}/Videos/${this.id}/stream.${mediaSource.Container}?static=true&mediaSourceId=${this.source_id}&deviceId=${device.serialNumber}&api_key=${api.token}&Tag=${mediaSource.ETag}`
    }
    // Transcoding
    else {
      this.method = "Transcode"
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
    this.progress = window.setInterval(() => this.notifyProgress("TimeUpdate"), 10000)
  }

  togglePlayPause () {
    // 1: Is playing, 2: Is paused, 3: Connecting, 4: Buffering, 5: Finished, 6: Error
    if (this.video.playState === 1) {
      this.video.pause();
      this.notifyProgress("pause")
    }
    else if (this.video.playState === 2) {
      this.video.play();
      this.notifyProgress("unpause")
    }
  }

  seek () {
    this.video.seek()
  }

  isPaused () {
    if (this.video && this.video.playState === 2) {
      return true
    }
    return false
  }

  stop () {
    this.notifyStop()
    this.video.onPlayStateChange = undefined
    window.clearInterval(this.progress)
    this.video.stop()
    pop()
  }
}
