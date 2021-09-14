import { wrap } from 'svelte-spa-router/wrap'
import Home from './views/Home.svelte'
import Player from './views/Player.svelte'

const routes = {
  // Exact path
  '/': Home,
  '/login': wrap({
    asyncComponent: () => import('./views/Login.svelte')
  }),
  '/remote': wrap({
    asyncComponent: () => import('./views/Remote.svelte')
  }),
  '/player/:id': Player
}

export default routes
