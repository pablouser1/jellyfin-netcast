<script>
  import { push } from "svelte-spa-router";
  import lazyLoad from "../../helpers/LazyLoad";
  export let items = [];
</script>

<div class="horizontal-container">
    {#each items as item}
      <div on:click={() => push(item.url)} class="item focusable">
        <img use:lazyLoad={item.img} alt={item.name} />
        <p>{item.name}</p>
      </div>
    {/each}
</div>

<style>
  .horizontal-container {
    display: -webkit-inline-box;
    display: inline-flex;
  }

  .item {
    -webkit-box-flex: 1;
    flex: 1;
    opacity: 1;
    width: 341.183px;
    height: 218.433px;
    cursor: pointer;
    padding: 10px 10px 10px 10px;
  }

  .item img {
    max-width: 100%;
  }

  /* Effects */
  .item:hover, .item:focus {
    opacity: 0.3;
  }
</style>
