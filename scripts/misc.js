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

function sendDeviceProfile() {
    loadJSON("/Sessions/Capabilities/Full", "POST",
    function (data) {
        console.log(data)
    },
    function (error) {
        console.log(error)
    }, JSON.stringify(device_profile))
}

function processKeyDown(e) {
    var keycode;
    if(window.event) { // IE
        keycode = e.keyCode;
    }
    else if(e.which) { // Netscape/Firefox/Opera You can tell just how old this guide is that they even mention netscape
        keycode = e.which;
    }
    return keycode
}

function generalEvents(e) {
    var keycode = processKeyDown(e)
    switch(keycode) {
        case VK_BACK:
            goBack()
            break;
    }
}
