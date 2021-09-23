<script>
  import Router, { location } from 'svelte-spa-router'
  import Navbar from './components/Navbar.svelte'
  import generalEvents from './helpers/Controls'
  import SpatialNav from './helpers/Spatial'
  import routes from './routes'

  SpatialNav.init()
  document.body.onkeydown = generalEvents
</script>

<main>
  {#if $location !== '/login' && !$location.startsWith('/player')}
    <Navbar />
  {/if}
  <Router {routes} on:routeLoaded={() => SpatialNav.refresh(true)}/>
</main>
