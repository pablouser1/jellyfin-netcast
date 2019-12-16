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
  // Check cookies and if all of them are not null, then redirect to main menu if true
  ip = "http://" + (document.cookie.match(/^(?:.*;)?\s*ip\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
  port = (document.cookie.match(/^(?:.*;)?\s*port\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
  whole_url = ip + ":" + port;
  user_global = (document.cookie.match(/^(?:.*;)?\s*username\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
  passwd = (document.cookie.match(/^(?:.*;)?\s*passwd\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
  id = (document.cookie.match(/^(?:.*;)?\s*id\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
  AccessToken = (document.cookie.match(/^(?:.*;)?\s*token\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
  if(ip && port && whole_url && id && user_global && passwd && AccessToken){
    useheaders = 1;
    params = 'Emby UserId="' + id + '", Client="Netcast", Device="' + modelName + '", DeviceId="' + serialNumber + '", Version="1.0.0.0" Token="' + AccessToken + "'";
    $(".login-box").hide();
    $("#content").show();
    $(".topnav").show();
    $("#watching").show();
    showlibrary();
    parent.location.hash = "#main_menu";
  }
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
    if (AccessToken != null) {
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
