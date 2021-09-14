import App from './App.svelte'
import Session from './session'
import { push } from 'svelte-spa-router'

// Styles
import './styles/animations.css'
import './styles/main.css'
import './styles/misc.css'

const app = new App({
  target: document.getElementById('app')
})

// Check if already logged in, sets token if the user is already logged in
if (!Session.check()) {
  push('/login')
}

export default app
