<script>
  import { onMount } from "svelte"
  import { parse } from 'qs'
  import { querystring } from 'svelte-spa-router'
  import { player } from '../common'

  // GET params
  let query = parse($querystring)
  // Item id
  export let params = {}
  onMount(() => {
    // Run player with following options
    player.run(params.id, query.media, query.audio, query.subtitle, query.user_id)
  })
</script>

<div id="video-wrapper">
  <!-- svelte-ignore a11y-missing-attribute -->
  <object id="video" type="application/x-netcast-av" />
  <div class="controls">
    <progress id="progress-bar" min="0" max="100" value="0" />
    <button>Rewind</button>
    <button>Pause</button>
    <button>Stop</button>
    <button>Fast Forward</button>
  </div>
</div>

<style>
  #video-wrapper {
    width: 100%;
    height: 100%;
  }

  #video-wrapper .controls {
    position: fixed;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    opacity: 0;
    transition: opacity 0.5s;
    transition-delay: 2s;
  }

  #video-wrapper .controls:hover {
    opacity: 1;
    transition-delay: 0s;
  }

  .controls progress {
    display: block;
    width: 100%;
    height: 81%;
    margin-top: 0.125rem;
    border: none;
    color: #0095dd;
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
    border-radius: 2px;
  }

  #video {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
</style>
