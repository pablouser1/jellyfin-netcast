var app_version = "1.3.0"
var device = document.getElementById("device");

// -- TESTS -- //
// This values are ignored on real TVs
device.modelName = "Testing";
device.serialNumber = "apptest";

// Default params
var default_params = 'Mediabrowser Client="Netcast", Device="' + device.modelName + '", DeviceId="' + device.serialNumber + '", Version="' + app_version;
var params = default_params

function toggleNavbar() {
  document.getElementById("navbar").classList.toggle("is-hidden")
}

/* Set the width of the side navigation to 250px */
function openDrawer() {
  document.getElementById("sideNav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeDrawer() {
  document.getElementById("sideNav").style.width = "0";
}

// Start when document loads
function initApp() {
  // Hide splashscreen
  document.getElementById("splashscreen").classList.add("is-hidden")
  changetab()
  console.log("Finished loading");
}

// Start main components once logged in
function startApp() {
  toggleNavbar()
  startWebSocket()
  sendDeviceProfile()
  startSpatialNav()
}

var tempuser = checkSession()
if (tempuser) {
  console.log("Already logged in")
  startApp();
  prepareLibrary();
  parent.location.hash = "#home";
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
    if (old_tab) {
      old_tab.classList.add("is-hidden")
    }
    new_tab.classList.remove("is-hidden")
  }

  // Focus the first navigable element.
  SpatialNavigation.focus();
}

window.addEventListener("hashchange", changetab)
