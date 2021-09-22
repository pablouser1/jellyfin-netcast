<script>
  import { api } from "../common"
  import { user } from "../store"
  import { afterUpdate, onMount } from "svelte"
  import { querystring } from 'svelte-spa-router'
  import { parse } from 'qs'
  import SpatialNav from "../helpers/Spatial"
  import Slider from "../components/Items/VSlider.svelte"

  const query = parse($querystring)
  let shows = []
  export let params = {}
  onMount(async () => {
    shows = await api.episodes(params.id, query.show_id, $user.id)
  })

  afterUpdate(() => {
    SpatialNav.refresh()
  })
</script>

<section class="tab">
  <Slider items={shows} />
</section>
