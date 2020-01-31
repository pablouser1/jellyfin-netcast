function init() {
  device = document.getElementById("device");
  $("#splash").hide();
  parent.location.hash = "#login";

  // TESTS--------------------//
  console.log("Using debugging info");
  modelName = "Testing";
  serialNumber = "apptest";
  //-------------------------------------//

  console.log("Starting");

}

// JSON Loading
function loadJSON(path, type, tof, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
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
  xhr.open(type, path, tof);
  if (useheaders === 1) {
    console.log(user_global);
    xhr.setRequestHeader("X-Emby-Authorization", params);
    xhr.setRequestHeader("Content-Type", "application/json");
    // If there's an Access token avaible, send it with the request.
    if (AccessToken) {
      xhr.setRequestHeader("X-MediaBrowser-Token", AccessToken);
    }
    //If headers are used, send also username and password.
    xhr.send('{ "Username":' + user_global + ', "Pw":' + passwd + '}');
  } else {
    xhr.send();
  }
}

//Back button
function back() {

  var hash = window.location.hash.substring(1);
  console.log(hash);
  // Probably a better way to do this
  if (hash == 'items') {
    $("#content").show();
    $("#watching").show();
    $("#items").hide();
    parent.location.hash = "#main_menu";
  }
  if (hash == 'seasons') {
    $("#items").show();
    $("#seasons").hide();
    parent.location.hash = "#items";
  }
}
