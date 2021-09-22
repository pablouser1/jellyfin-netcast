<script>
  import { push } from "svelte-spa-router"
  import { api } from "../common"
  import Session from "../session"

  // Host validation
  let host = ""
  let validHost = false
  // Login
  let username = ""
  let password = ""

  const checkHost = async () => {
    api.host = host
    const res = await api.ping()
    if (res) {
      validHost = true
    } else {
      console.error("Invalid host")
    }
  }

  const login = async () => {
    const res = await api.login(username, password)
    Session.set(host, res.token, res.id, res.name)
    Session.start(host, res.token)
    push("/")
  }
</script>

<section class="tab">
  <div class="login-page">
    <div class="form">
      {#if !validHost}
        <div class="host-form">
          <input
            type="text"
            placeholder="http://192.168.1.10:8096"
            bind:value={host}
          />
          <button on:click={checkHost}>Check host</button>
        </div>
      {:else}
        <div class="login-form">
          <label for="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            placeholder="Username"
            bind:value={username}
          />
          <label for="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Password"
            bind:value={password}
          />
          <button on:click={login}>Login</button>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  /* Login form from https://codepen.io/colorlib/pen/rxddKy */
  .login-page {
    width: 360px;
    padding: 8% 0 0;
    margin: auto;
  }
  .form {
    position: relative;
    z-index: 1;
    background: #ffffff;
    max-width: 360px;
    margin: 0 auto 100px;
    padding: 45px;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }
  .form input {
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
  }
  .form button {
    text-transform: uppercase;
    outline: 0;
    background: #1f97be;
    width: 100%;
    border: 0;
    padding: 15px;
    color: #ffffff;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
  }
  .form button:hover,
  .form button:active,
  .form button:focus {
    background: #00a4dc;
  }
  /*
  .form .message {
    margin: 15px 0 0;
    color: #b3b3b3;
    font-size: 12px;
  }
  .form .message a {
    color: #00a4dc;
    text-decoration: none;
  }
  */

  .form label {
    color: black;
  }
</style>
