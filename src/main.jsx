import { render } from 'preact'
import { route } from 'preact-router'
import App from './app'
import './styles/main.scss'

import Auth from './services/Auth'

const hasSession = Auth.checkSession()

render(<App />, document.getElementById('app'))

if (!hasSession) {
  route('/login')
}
