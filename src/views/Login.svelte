<script>
  import { push } from 'svelte-spa-router'
  import '../styles/login.css'
  import { api } from '../common'
  import Session from '../session'

  // Host validation
  let host = ''
  let validHost = false
  // Login
  let username = ''
  let password = ''

  const checkHost = async () => {
    api.host = host
    const res = await api.ping()
    if (res) {
      validHost = true
    } else {
      console.error('Invalid host')
    }
  }

  const login = async () => {
    const res = await api.login(username, password)
    Session.set(host, res.token, res.id, res.name)
    Session.start(host, res.token)
    push('/')
  }
</script>

<section>
  <div class="login-page">
    <div class="form">
      {#if !validHost}
        <div class="host-form">
          <input type="text" placeholder="http://192.168.1.10:8096" bind:value={host}/>
          <button on:click={checkHost}>Check host</button>
        </div>
      {:else}
        <div class="login-form">
          <label for="login-username">Username</label>
          <input id="login-username" type="text" placeholder="Username" bind:value={username}/>
          <label for="login-password">Password</label>
          <input id="login-password" type="password" placeholder="Password" bind:value={password}/>
          <button on:click={login}>Login</button>
        </div>
      {/if}
    </div>
  </div>
</section>
