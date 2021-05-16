import { Component } from 'preact'
import store from '../../store'
import linkState from 'linkstate'
import Auth from '../../services/Auth'

export default class HostBox extends Component {
  state = {
    host: ''
  }

  async isHostValid () {
    store.set('host', this.state.host)
    const valid = await Auth.checkHost()
    if (valid) {
      console.log('Valid host')
      this.props.isValidHost()
    } else {
      console.log('Not valid host')
    }
  }

  render () {
    return (
      <div id="host-box">
        <h1>Host</h1>
        { /* IP INPUT */ }
        <label for="host_input">Server:</label>
        <input id="host_input" type="text" onChange={linkState(this, 'host')} />
        { /* BOTTOM */ }
        <button onClick={() => this.isHostValid(this.state.host)}>Set host</button>
      </div>
    )
  }
}
