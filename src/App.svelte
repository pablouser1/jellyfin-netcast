<script>
  import Router, { location } from 'svelte-spa-router'
  import Navbar from './components/Navbar.svelte'
  import SpatialNav from './helpers/Spatial'
  import routes from './routes'

  SpatialNav.init()
</script>

<main>
  {#if $location !== '/login'}
    <Navbar />
  {/if}
  <Router {routes} on:routeLoaded={() => SpatialNav.refresh(true)}/>
</main>
