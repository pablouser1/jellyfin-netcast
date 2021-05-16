class ShowError {
  static snack (error) {
    // Get the snackbar DIV
    const snack = document.getElementById('snackbar')
    snack.innerHTML = error
    // Add the "show" class to DIV
    snack.className = 'show'

    // After 3 seconds, remove the show class from DIV
    setTimeout(() => {
      snack.className = snack.className.replace('show', '')
    }, 3000)
  }
}

export default ShowError
