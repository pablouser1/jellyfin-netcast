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
  xhr.open(type, path, "true");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Emby-Authorization", params);
  if (loggedin == 1) {
    xhr.send();
  } else {
    xhr.send('{"Username":"' + username + '","Pw":"' + passwd + '"}');
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
    document.getElementById("items").innerHTML = ""
    parent.location.hash = "#main_menu";
  }
  if (hash == 'seasons') {
    $("#items").show();
    $("#seasons").hide();
    document.getElementById("seasons").innerHTML = ""
    parent.location.hash = "#items";
  }
  if (hash == 'episodes') {
    $("#seasons").show();
    $("#episodes").hide();
    document.getElementById("episodes").innerHTML = ""
    parent.location.hash = "#seasons";
  }
}