var useheaders = 0;
var AccessToken;

function login() {
  //Store login info
  ip = document.getElementById("ip_input").value;
  port = document.getElementById("port_input").value;
  document.cookie = "ip=" + ip + "; max-age=31536000; path=/";
  document.cookie = "port=" + port + "; max-age=31536000; path=/";
  console.log(ip + " " + port);
  if (port) {
    whole_url = "http://" + ip + ":" + port
  }
  else {
    whole_url = "http://" + ip;
  }

  //Get all users and show them.
  loadJSON(whole_url + "/jellyfin/Users/Public", "GET", "true",
    function(data) {
      $(".login-box").hide();
      $("#users").show();
      var i = 0;
      while (i < data.length) {
        console.log(i + " " + data[i].Name);
        $(users_table).find("tbody").append("<td><a href='javascript:user(" + '"' + data[i].Name + '"' + ");'>" + "<img src=assets/images/menus/user_icon.png width='152' height='152'</a></td>");
        $(users_table).find("tfoot").append("<td>" + data[i].Name + "</td>");
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
  document.cookie = "username=" + username + "; max-age=31536000; path=/";
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
      document.cookie = "id=" + id + "; max-age=31536000; path=/";
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
  document.cookie = "passwd=" + passwd + "; max-age=31536000; path=/";
  //Set headers. (Probably there's a better way to do this)
  useheaders = 1;

  params = 'Emby UserId="' + id + '", Client="Netcast", Device="' + modelName + '", DeviceId="' + serialNumber + '", Version="1.0';
  loadJSON(whole_url + "/jellyfin/Users/authenticatebyname", "POST", "false",
    function(data) {
      AccessToken = data.AccessToken;
      console.log("Your access token is: " + AccessToken);
      document.cookie = "token=" + AccessToken + "; max-age=31536000; path=/";
      params = 'Emby UserId="' + id + '", Client="Netcast", Device="' + modelName + '", DeviceId="' + serialNumber + '", Version="1.0.0.0" Token="' + AccessToken + "'";
      showlibrary();
      $(".password-box").hide();
      $("#content").show();
      $(".topnav").show();
      $("#watching").show();
    },
    function(xhr) {
      console.error(xhr);
    }
  );
  parent.location.hash = "#main_menu";
}
