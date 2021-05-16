import { Component } from 'preact'
import HostBox from '../components/Login/HostBox'
import UserBox from '../components/Login/UserBox'
import '../styles/login.scss'


export default class Login extends Component {
  state = {
    verifiedHost: false
  }

  constructor () {
    super()
    this.setVerified = this.setVerified.bind(this)
  }

  setVerified () {
    this.setState({
      verifiedHost: true
    })
  }

  render () {
    let box;
    if (!this.state.verifiedHost) {
      box = <HostBox isValidHost={this.setVerified} />
    } else {
      box = <UserBox />
    }
    return (
      <section id="login">
        { box }
      </section>
    )
  }
}
