<script>
  import Router, { location } from 'svelte-spa-router'
  import SpatialNavigation from 'spatial-navigation-js'
  import Navbar from './components/Navbar.svelte'
  import routes from './routes'

  const refreshSpatial = () => {
    SpatialNavigation.makeFocusable()
    SpatialNavigation.focus('.item')
  }

  // Spatial nav
  SpatialNavigation.init()
  SpatialNavigation.add({
    selector: 'a, button, input, .focusable, .item'
  })
</script>

<main>
  {#if $location !== '/login'}
    <Navbar />
  {/if}
  <Router {routes} on:routeLoaded={refreshSpatial}/>
</main>
