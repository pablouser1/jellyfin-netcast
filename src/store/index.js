import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      host: '',
      user: {
        id: '',
        name: '',
        token: ''
      }
    }
  },
  mutations: {
    setHost (state, host) {
      state.host = host
    },

    setUser (state, user) {
      state.user = user
    }
  }
})

export default store
