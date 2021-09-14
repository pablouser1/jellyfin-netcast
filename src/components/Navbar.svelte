<script>
  import { pop } from 'svelte-spa-router'
</script>

<div class="nav">
  <div class="nav-header">
    <div class="nav-title">
      Jellyfin
    </div>
  </div>

  <div class="nav-links">
    <a href="#/remote">Remote</a>
    <a href="#/debug">Debug</a>
    <button on:click={pop}>Back</button>
  </div>
</div>
