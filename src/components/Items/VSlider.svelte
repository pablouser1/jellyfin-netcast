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
  }

  .item {
    -webkit-flex: 0 1 auto;
    flex: 0 1 auto;
    opacity: 1;
    cursor: pointer;
    padding: 10px 10px 10px 10px;
  }

  .item img {
    height: 341.183px;
    width: 218.433px;
  }

  .item p {
    width: 218.433px;
  }

  /* Effects */
  .item:hover, .item:focus {
    opacity: 0.3;
  }
</style>
