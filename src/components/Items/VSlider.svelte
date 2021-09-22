<script>
  import { push } from "svelte-spa-router";
  import lazyLoad from "../../helpers/LazyLoad";
  export let items = [];
</script>

<div class="vertical-container">
  {#each items as item}
    <div on:click={() => push(item.url)} class="item focusable">
      <img use:lazyLoad={item.img} alt={item.name} />
      <p>{item.name}</p>
    </div>
  {/each}
</div>

<style>
  .vertical-container {
    display: -webkit-box;
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: space-evenly;
    justify-content: space-evenly;
  }

  .item {
    -webkit-box-flex: 0;
    flex: 0 1 auto;
    opacity: 1;
    cursor: pointer;
  }

  .item img {
    max-width: 100%;
  }

  /* Effects */
  .item:hover, .item:focus {
    opacity: 0.3;
  }
</style>
