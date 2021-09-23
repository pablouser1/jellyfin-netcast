/**
 * @param {HTMLElement} node
 * @param {string} src
 * @description Lazy load an image
 * @author https://lwkchan.com/blog/lazy-loading-images-in-svelte-3/
 */
function lazyLoad(node, src) {
  const observer = new IntersectionObserver(onIntersect, {
    // If the image gets within 50px in the Y axis, start the download.
    rootMargin: "50px 0px",
    threshold: 0.01,
  });

  function onIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        node.setAttribute("src", src);
      }
    });
  }

  observer.observe(node);
  return {
    destroy() {
      observer && observer.unobserve(node);
    },
  };
}

export default lazyLoad;
