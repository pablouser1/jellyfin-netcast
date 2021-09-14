<script>
  import { onMount } from "svelte"
  import { parse } from 'qs'
  import { querystring } from 'svelte-spa-router'

  // GET params
  $: query = parse($querystring)
  // Item id
  export let params = {}
  onMount(() => {
    console.log(params, query)
  })
</script>

<div id="video-wrapper" class="tab is-hidden">
  <!-- svelte-ignore a11y-missing-attribute -->
  <object id="video" type="application/x-netcast-av" />
  <div class="controls">
    <progress id="progress-bar" min="0" max="100" value="0" />
    <button>Rewind</button>
    <button>❙❙</button>
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
