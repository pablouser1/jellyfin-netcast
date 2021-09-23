import { wrap } from 'svelte-spa-router/wrap'
import Home from './views/Home.svelte'
import Player from './views/Player.svelte'

const routes = {
  // Exact path
  '/': Home,
  '/login': wrap({
    asyncComponent: () => import('./views/Login.svelte')
  }),
  '/movies/:id': wrap({
    asyncComponent: () => import('./views/Movies.svelte')
  }),
  '/tvshows/:id': wrap({
    asyncComponent: () => import('./views/TVShows.svelte')
  }),
  '/seasons/:id': wrap({
    asyncComponent: () => import('./views/Seasons.svelte')
  }),
  '/episodes/:id': wrap({
    asyncComponent: () => import('./views/Episodes.svelte')
  }),
  '/details/:id': wrap({
    asyncComponent: () => import('./views/Details.svelte')
  }),
  '/player/:id': Player
}

export default routes
