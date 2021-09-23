<script>
  // @ts-nocheck
  import FaPlay from "svelte-icons/fa/FaPlay.svelte";
  import FaPause from "svelte-icons/fa/FaPause.svelte";
  import FaStop from "svelte-icons/fa/FaStop.svelte";
  import { onDestroy, onMount } from "svelte";
  import { parse } from "qs";
  import { querystring } from "svelte-spa-router";
  import { player } from "../common";
  import { writable } from "svelte/store";
  let scrollbar = 0;
  const progress = writable(0);

  // GET params
  let query = parse($querystring);
  let isPaused = false;

  // Item id
  export let params = {};

  const updateProgressBar = () => {
    const video = document.getElementById("video");
    if (video.playState) {
      const percentage = Math.round(
        (video.playPosition / video.playTime) * 100
      );
      progress.set(percentage);
    }
  };

  const togglePlayPause = () => {
    player.togglePlayPause();
    isPaused = !isPaused;
  };

  onMount(() => {
    player.run(params.id, query.media, query.audio, query.subtitle, query.user_id);
    scrollbar = window.setInterval(() => updateProgressBar, 5000);
  });

  onDestroy(() => {
    window.clearInterval(scrollbar);
  });
</script>

<div id="video-wrapper">
  <!-- svelte-ignore a11y-missing-attribute -->
  <object id="video" type="application/x-netcast-av" />
  <!-- svelte-ignore a11y-media-has-caption -->
  <!--
  <video id="video" autoplay>
    <source src="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_1920_18MG.mp4" />
  </video>
  -->
  <div class="controls">
    <div class="control-btn" on:click={() => togglePlayPause()}>
      {#if isPaused}
        <FaPlay />
      {:else}
        <FaPause />
      {/if}
    </div>
    <div class="control-btn" on:click={() => player.stop()}>
      <FaStop />
    </div>
    <progress min='0' max='100' value={$progress}></progress>
  </div>
</div>

<style>
  #video-wrapper {
    width: 100%;
    height: 100%;
  }

  #video-wrapper .controls {
    width: 100%;
    height: 5%;
    display: -webkit-box;
    display: flex;
    position: fixed;
    bottom: 0;
    -webkit-box-pack: center;
            justify-content: center;
    -webkit-box-align: center;
            align-items: center;
    align-content: center;
    gap: 10px;
    background: grey;
    opacity: 0;
    -webkit-transition: opacity 0.5s;
    transition: opacity 0.5s;
    -webkit-transition-delay: 2s;
            transition-delay: 2s;
  }

  .controls .control-btn {
    width: 25px;
    height: 100%;
  }

  #video-wrapper #video {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }

  #video-wrapper .controls:hover {
    opacity: 1;
    -webkit-transition-delay: 0s;
            transition-delay: 0s;
  }

  .controls progress {
    -webkit-box-flex: 1;
            flex: 1 1 auto;
    display: block;
    height: 90%;
    color: #0095dd;
  }
</style>
