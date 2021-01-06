var app_version = "1.2.0"
var device = document.getElementById("device");

// -- TESTS -- //
// This values are ignored on real TVs
device.modelName = "Testing";
device.serialNumber = "apptest";

// Default params
var default_params = 'Mediabrowser Client="Netcast", Device="' + device.modelName + '", DeviceId="' + device.serialNumber + '", Version="' + app_version;
var params = default_params
console.log("Starting");

var tempuser = checkSession()
if (tempuser) {
  console.log("Already logged in")
  parent.location.hash = "#mainmenu";
  prepareLibrary();
}
else {
  parent.location.hash = "#login";
}

function goBack() {
  window.history.back()
}

// -- Hash (router) -- //
function changetab() {
  var hash = window.location.hash.substring(1);
  // Choose tab not hidden (currently active)
  var old_tab = document.querySelector(".tab:not(.is-hidden)")
  var new_tab = document.getElementById(hash);
  if (!new_tab) {
    console.error("Error while loading " + hash + ", that tab doesn't exist")
  }
  else {
    old_tab.classList.add("is-hidden")
    new_tab.classList.remove("is-hidden")
  }
}

window.addEventListener("hashchange", changetab)
changetab()
