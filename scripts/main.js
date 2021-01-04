var app_version = "1.0.0"
var device = document.getElementById("device");

// TESTS--------------------//
console.log("Using debugging info");
device.modelName = "Testing";
device.serialNumber = "apptest";
//-------------------------------------//

// Default params
var params = 'Mediabrowser Client="Netcast", Device="' + device.modelName + '", DeviceId="' + device.serialNumber + '", Version="' + app_version;
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

// JSON Loading
function loadJSON(path, type, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success)
          success(JSON.parse(xhr.responseText));
      } else {
        if (error)
          error(xhr);
      }
    }
  };
  xhr.open(type, path, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Emby-Authorization", params);
  xhr.send();
}

// -- Hash (router) -- //
function changetab() {
  let hash = window.location.hash.substring(1);
  // Choose tab not hidden (currently active)
  let old_tab = document.querySelector(".tab:not(.is-hidden)")
  let new_tab = document.getElementById(hash);
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
