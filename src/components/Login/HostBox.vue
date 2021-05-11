<template>
  <div id="host-box">
    <h1>Host</h1>
    <label for="host_input">Server:</label>
    <input id="host_input" v-model="host" type="text" />
    <button @click="setHost()">Set host</button>
  </div>
</template>

<script>
import Auth from '../../services/Auth'
export default {
  name: 'HostBox',
  methods: {
    async setHost() {
      this.$store.commit("setHost", this.host)
      const valid = await Auth.checkHost()
      if (valid) {
        console.log('Valid host')
        this.$emit('valid-host')
      } else {
        console.log('Not valid host')
      }
    }
  },
  data () {
    return {
      host: ''
    }
  }
}
</script>
