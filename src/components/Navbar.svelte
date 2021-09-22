<script>
  import { pop } from 'svelte-spa-router'
</script>

<div class="nav">
  <div class="nav-header">
    <a class="nav-title" href="#/">Jellyfin</a>
  </div>
  <div class="nav-links">
    <button on:click={pop}>Back</button>
  </div>
</div>
