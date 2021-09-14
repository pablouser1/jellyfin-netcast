import device from "./device"
import Player from './helpers/Player'

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
    this.socket.onmessage = (event) => this.on(event)
  }

  /**
   * @param {string} name
   */
  sendData (name, data = null) {
    console.log(`Sending WS with name: ${name}`);

    let msg = {
      MessageType: name
    }

    if (data) {
      msg.Data = data
    }

    const msg_string = JSON.stringify(msg);
    this.socket.send(msg_string)
  }

  sendKeepAlive () {
    this.sendData('KeepAlive')
  }

  /**
   * @param {{ data: string; }} e
   */
  on(e) {
    const message = JSON.parse(e.data)
    switch (message.MessageType) {
      case "ForceKeepAlive":
        this.sendKeepAlive()
        this.KA_interval = window.setInterval(() => this.sendKeepAlive, message.Data * 1000 * 0.5)
        break
      case "GeneralCommand":
        // TODO
        break
      case "Play":
        // TODO
        break
      case "Playstate":
        // TODO
        break
    }
  }
}
