function showToast(text) {
    // Get the snackbar DIV
    var snack = document.getElementById("snackbar");
    snack.innerHTML = text
    // Add the "show" class to DIV
    snack.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        snack.className = snack.className.replace("show", "");
    }, 3000);
}
