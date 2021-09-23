export const makeToast = (/** @type {string} */ text) => {
  var x = document.getElementById("snackbar")
  x.innerText = text
  x.className = "show"
  setTimeout(() => {
    x.className = x.className.replace("show", "")
  }, 3000)
}
