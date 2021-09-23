import device from "./device"
import { pop, push } from "svelte-spa-router"
import SpatialNav from "./helpers/Spatial"

export default class JellySocket {
  socket = null
  KA_interval = 0

  /**
   * @param {string} host
   * @param {string} api_key
   */
  start(host, api_key) {
    this.socket = new WebSocket(
      `${host}/socket?api_key=${api_key}&deviceId=${device.serialNumber}`
    )
    this.socket.onmessage = (/** @type {{ data: string }} */ event) => this.on(event)
  }

  /**
   * @param {string} name
   */
  sendData(name, data = null) {
    console.log(`Sending WS with name: ${name}`)

    let msg = {
      MessageType: name,
    }

    if (data) {
      msg.Data = data
    }

    const msg_string = JSON.stringify(msg)
    this.socket.send(msg_string)
  }

  sendKeepAlive() {
    this.sendData("KeepAlive")
  }

  /**
   * @param {{ Name: string; }} message
   */
  generalCommand(message) {
    switch (message.Name) {
      case "MoveUp":
        SpatialNav.move("up")
        break
      case "MoveDown":
        SpatialNav.move("down")
        break
      case "MoveLeft":
        SpatialNav.move("left")
        break
      case "MoveRight":
        SpatialNav.move("right")
        break
      case "Select":
        // @ts-ignore
        document.activeElement.click()
        break
      case "Back":
        pop()
        break
      case "GoHome":
        push('/')
        break
    }
  }
  /**
   * @param {{ data: string }} e
   */
  on(e) {
    const message = JSON.parse(e.data)
    switch (message.MessageType) {
      case "ForceKeepAlive":
        this.sendKeepAlive()
        this.KA_interval = window.setInterval(
          () => this.sendKeepAlive,
          message.Data * 1000 * 0.5
        )
        break
      case "GeneralCommand":
        this.generalCommand(message.Data)
        break
      case "Play":
        // Run player
        const data = message.Data
        push(`/player/${data.ItemsIds[0]}?media=${data.MediaSourceId}&audio=${data.AudioStreamIndex}&subtitle=${data.SubtitleStreamIndex}&user_id=${data.ControllingUserId}`)
        break
      case "Playstate":
        // TODO
        break
    }
  }
}
