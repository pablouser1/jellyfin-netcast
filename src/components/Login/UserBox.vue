<template>
  <div id="user-box">
    <h1>User</h1>
    <label for="user_input">Username:</label>
    <input id="user_input" type="text" v-model="username" />
    <label for="password_input">Password:</label>
    <input id="password_input" type="password" v-model="password" />
    <button @click="startLogin">Login</button>
  </div>
</template>

<script>
import Auth from '../../services/Auth'
export default {
  name: 'LoginBox',
  methods: {
    async startLogin () {
      const res = await Auth.login(this.username, this.password)
      if (res) {
        this.$router.push("/")
      }
    }
  },
  data () {
    return {
      username: '',
      password: ''
    }
  }
}
</script>

<style>

</style>
