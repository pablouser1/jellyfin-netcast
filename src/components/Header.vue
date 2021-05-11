<template>
  <div id="navbar" class="is-hidden">
    <div class="right">
      <a class="navbar-item" @click="logout">Logout</a>
    </div>
  </div>
</template>

<script>
import Cookies from '../helpers/Cookies'
export default {
  name: 'Header',
  methods: {
    logout () {
      Cookies.delete("jellyfin-netcast")
      this.$router.push("/login")
    }
  }
}
</script>

<style lang="scss" scoped>
#navbar {
  height: 50px;
  overflow: hidden;
  background-color: #202020;
  .left {
    float: left;
  }

  .right {
    float: right;
  }
}

.navbar-item {
  display: inline-block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
    color: black;
  }
}
</style>
