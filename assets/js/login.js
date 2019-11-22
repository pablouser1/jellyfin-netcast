var useheaders = 0;
var AccessToken;

function login() {
  //Store login info
  ip = document.getElementById("ip").value;
  port = document.getElementById("port").value;
  console.log(ip + " " + port);
  whole_url = ip + ":" + port;

  //Get all users and show them.
  loadJSON(whole_url + "/jellyfin/Users/Public", "GET", "true",
    function(data) {
      $(".login-box").hide();
      $("#users").show();
      var i = 0;
      while (i < data.length) {
        console.log(i + " " + data[i].Name);
        document.getElementById("users").innerHTML = "<a href='javascript:user(" + '"' + data[i].Name + '"' + ");'>" + "<img src=assets/images/menus/user_icon.png width='152' height='152' id=" + "'" + data[i].Name + "'" + "</a>";
        i++;
      }
    },
    function(xhr) {
      console.error(xhr);
      alert("There was an error trying to connect to the server, is the server up?");
    }
  );
}

function user(username) {
  user_global = username;
  //Get User's ID
  loadJSON(whole_url + "/jellyfin/Users/Public", "GET", "true",
    function(data) {
      var i = 0;
      while (i < data.length) {
        console.log(i + " " + data[i].Name);
        if (data[i].Name === username) {
          id = data[i].Id;
        }
        i++;
      }
      console.log("Your user ID is: " + id);
      $("#users").hide();
      $(".password-box").show();
    },
    function(xhr) {
      console.error(xhr);
      alert("There was an error while trying to retrieve your user id");
    }
  );

}

function password() {
  //Store passwd
  passwd = document.getElementById("password_input").value;
  //Set headers. (Probably there's a better way to do this)
  useheaders = 1;
  // TESTS--------------------//
  console.log("Using debugging info");
  var modelName = "Testing";
  var serialNumber = "apptest";
  //-------------------------------------//

  text = 'Emby UserId="' + id + '", Client="Netcast", Device="' + modelName + '", DeviceId="' + serialNumber + '", Version="1.0';
  loadJSON(whole_url + "/jellyfin/Users/authenticatebyname", "POST", "false",
    function(data) {
      AccessToken = data.AccessToken;
      console.log("Your access token is:" + AccessToken);
      text = 'Emby UserId="' + id + '", Client="Netcast", Device="' + modelName + '", DeviceId="' + serialNumber + '", Version="1.0.0.0" Token="' + AccessToken + "'";
      $(".password-box").hide();
      $("#content").show();
    },
    function(xhr) {
      console.error(xhr);
    }
  );

}
