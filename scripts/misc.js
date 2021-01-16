/**
 * Show message
 * @param {string} text Message text
 */
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

/**
 * Send device profile to server
 */
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
    else if(e.which) { // Netscape/Firefox/Opera You can tell how old this guide is when they mention Netscape
        keycode = e.which;
    }
    return keycode
}

function startSpatialNav() {
    SpatialNavigation.init();
    // Define navigable elements
    SpatialNavigation.add({
      selector: '.item',
      enterTo: 'last-focused',
      defaultElement: 'library',
      restrict: 'self-first'
    });
}

function generalEvents(e) {
    var keycode = processKeyDown(e)
    switch(keycode) {
        // BACK
        case 461:
            goBack()
            break;
        // Click
        case 13:
            var focused = document.activeElement;
            if (focused) {
                focused.click()
            }
            break;
    }
}
