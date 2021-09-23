<script>
  import { api } from "../common"
  import { user } from "../store"
  import { onMount } from "svelte"
  import { push } from "svelte-spa-router"
  export let params = {}
  let name = ''
  let overview = ''
  let item_id = params.id
  let media_id = ''
  let audios = []
  let selected_audio = -1
  let subtitles = []
  let selected_subtitle = -1

  onMount(async () => {
    const res = await api.item(item_id, $user.id)
    const media_source = res.MediaSources[0]
    name = res.Name
    overview = res.Overview
    media_id = media_source.Id
    media_source.MediaStreams.forEach((/** @type {{ Index: string; DisplayTitle: string; Type: string; }} */ element) => {
      let item = {
        value: element.Index,
        label: element.DisplayTitle
      }
      switch(element.Type) {
        case 'Audio':
          audios = [...audios, item]
          break
        case 'Subtitle':
          subtitles = [...subtitles, item]
          break
      }
    })
  })

  const startPlaying = () => {
    push(`/player/${item_id}?media=${media_id}&audio=${selected_audio}&subtitle=${selected_subtitle}&user_id=${$user.id}`)
  }
</script>

<section class="tab">
  <h3>{name}</h3>
  <p>{overview}</p>
  <!-- Audio -->
  <select bind:value={selected_audio}>
    {#each audios as audio}
      <option value={audio.value}>{audio.label}</option>
    {/each}
  </select>
  <!-- Subtitle -->
  <select bind:value={selected_subtitle}>
    {#each subtitles as subtitle}
      <option value={subtitle.value}>{subtitle.label}</option>
    {/each}
  </select>
  <button on:click={startPlaying}>Play</button>
</section>
