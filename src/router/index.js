import { createWebHashHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', component: Home }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes
})

export default router
