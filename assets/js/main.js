function init() {
  var device = document.getElementById("device");
  $("#splash").hide();
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
    xhr.setRequestHeader("X-Emby-Authorization", text);
    xhr.setRequestHeader("Content-Type", "application/json");
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
  //TODO
}
