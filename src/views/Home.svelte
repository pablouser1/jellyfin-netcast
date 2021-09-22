<script>
  import { api } from "../common"
  import { afterUpdate, onMount } from "svelte"
  import Slider from "../components/Items/HSlider.svelte"
  import { user } from "../store"
  import SpatialNav from "../helpers/Spatial"

  let libraries = []
  let watching = []
  onMount(async () => {
    libraries = await api.library($user.id)
    watching = await api.watching($user.id)
  })

  afterUpdate(() => {
    SpatialNav.refresh()
  })
</script>

<section class="tab">
  <p>Library</p>
  <Slider items={libraries} />
  <p>Continue watching</p>
  <Slider items={watching} />
</section>
