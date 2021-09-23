import { pop } from "svelte-spa-router";

const processKeyDown = (/** @type {KeyboardEvent} */ e) => {
  var keycode;
  if (window.event) { // IE
    keycode = e.keyCode;
  }
  else if (e.which) { // Netscape/Firefox/Opera You can tell how old this guide is when they mention Netscape
    keycode = e.which;
  }
  return keycode
}

const generalEvents = (/** @type {KeyboardEvent} */ e) => {
  var keycode = processKeyDown(e)
  switch (keycode) {
    // Go back
    case 461:
      pop()
      break
    // Click currently focused element
    case 13:
      var focused = document.activeElement
      if (focused) {
        // @ts-ignore
        focused.click()
      }
      break
  }
}

export default generalEvents
