<script>
  import { api } from "../common";
  import { afterUpdate, onMount } from "svelte";
  import Slider from "../components/Items/VSlider.svelte";
  import { user } from "../store";
  import SpatialNav from "../helpers/Spatial";

  let shows = []
  export let params = {}
  onMount(async () => {
    shows = await api.seasons(params.id, $user.id)
  })

  afterUpdate(() => {
    SpatialNav.refresh()
  })
</script>

<section class="tab">
  <Slider items={shows} />
</section>
