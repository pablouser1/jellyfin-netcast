<template>
  <Header v-show="enableHeader" />
  <router-view />
</template>

<script>
import Header from './components/Header.vue'
export default {
  name: 'App',
  components: { Header },
  computed: {
    enableHeader() {
      return this.$route.path !== "/login"
    }
  }
}
</script>

<style>
body {
  background: #101010;
  color: white;
}

section {
  padding: 3rem 1.5rem;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
