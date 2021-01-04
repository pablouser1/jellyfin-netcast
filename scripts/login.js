var userinfo = {}

function checkserver(host, response) {

  // A ping, kinda. Just to make sure that the server is alive
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", host + "/Users/Public", true);
  try {
    xhttp.send();
    response(true)
  } catch (NetworkError) {
    response(false)
  }
}

function checkHost() {
  host = document.getElementById("host_input").value;
  checkserver(host, function(res) {
    if (res) {
      $(".host-box").hide();
      $(".user-box").show();
    }
    else {
      alert("Error")
    }
  })
}

function loginreq(username, passwd, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", host + "/Users/authenticatebyname", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-Emby-Authorization", params);
  xhr.send('{"Username":"' + username + '","Pw":"' + passwd + '"}');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) {
          success(JSON.parse(xhr.responseText));
        }
      } else {
        if (error) error(xhr);
      }
    }
  };
}

function startLogin() {
  //Store user info
  var username = document.getElementById("username_input").value;
  var passwd = document.getElementById("password_input").value;

  loginreq(username, passwd,
    function(res) {
      userinfo["id"] = res.User.Id
      userinfo["name"] = res.User.Name
      userinfo["token"] = res.AccessToken
      userinfo["host"] = host
      setCookie("login", JSON.stringify(userinfo), 30)
      // Append token to params for all future requests
      params += ', Token="' + userinfo["token"] + '"';
      console.log("Userinfo:")
      console.log(userinfo)
      prepareLibrary();
      parent.location.hash = "#mainmenu";
    },
    function(error) {
      console.error(error)
    }
  )

}
// -- Cookies -- //
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// -- Sessions -- //

// Login if there are cookies already
function checkSession() {
  console.log("Checking session...")
  var tempuser = getCookie("login")
  if (tempuser) {
    console.log("Found session")
    var tempuser_json = JSON.parse(tempuser)
    userinfo.id = tempuser_json.id
    userinfo.name = tempuser_json.name
    userinfo.token = tempuser_json.token
    host = tempuser_json.host
    params += ', Token="' + userinfo["token"] + '"';
    return true
  }
  else {
    console.log("No session found")
    return false
  }
}
