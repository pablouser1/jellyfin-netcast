import { Component } from 'preact'
import linkState from 'linkstate'
import Auth from '../../services/Auth'

export default class Login extends Component {
  state = {
    username: '',
    password: ''
  }

  render () {
    return (
      <div id="user-box">
        <h1>User</h1>
        { /* User INPUT */ }
        <label for="user_input">Username:</label>
        <input id="user_input" type="text" onChange={linkState(this, 'username')} />
        { /* Password INPUT */ }
        <label for="password_input">Password:</label>
        <input id="password_input" type="password" onChange={linkState(this, 'password')} />
        { /* BOTTOM */ }
        <button onClick={async () => await Auth.login(this.state.username, this.state.password)}>Login</button>
      </div>
    )
  }
}
