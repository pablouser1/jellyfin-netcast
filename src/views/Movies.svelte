<script>
  import { api } from "../common";
  import { afterUpdate, onMount } from "svelte";
  import Slider from "../components/Items/VSlider.svelte";
  import { user } from "../store";
  import SpatialNav from "../helpers/Spatial";

  let items = []
  export let params = {}
  onMount(async () => {
    items = await api.collection(params.id, $user.id, 'Movie')
  })

  afterUpdate(() => {
    SpatialNav.refresh()
  })
</script>

<section class="tab">
  <Slider items={items} />
</section>
