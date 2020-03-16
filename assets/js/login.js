var useheaders = 0;
var AccessToken;

function login() {
  //Store login info
  var ip = document.getElementById("ip_input").value;
  var port = document.getElementById("port_input").value;
  console.log(ip + " " + port);
  if (port) {
    whole_url = "http://" + ip + ":" + port
  }
  else {
    whole_url = "http://" + ip;
  }

  //Get all users and show them.
  loadJSON(whole_url + "/jellyfin/Users/Public", "GET",
    function(data) {
      $(".login-box").hide();
      $("#users").show();
      for (i = 0; i < data.length; i++) {
        console.log(i + " " + data[i].Name);
        $(users_table).find("tbody").append("<td><a href='javascript:user(" + '"' + data[i].Name + '"' + ");'>" + "<img src=assets/images/menus/user_icon.png width='152' height='152'</a></td>");
        $(users_table).find("tfoot").append("<td>" + data[i].Name + "</td>");
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
  loadJSON(whole_url + "/jellyfin/Users/Public", "GET",
    function(data) {
      for (i = 0; i < data.length; i++) {
        console.log(i + " " + data[i].Name);
        if (data[i].Name === username) {
          id = data[i].Id;
        }
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

  params = 'Emby UserId="' + id + '", Client="Netcast", Device="' + modelName + '", DeviceId="' + serialNumber + '", Version="1.0';
  loadJSON(whole_url + "/jellyfin/Users/authenticatebyname", "POST",
    function(data) {
      AccessToken = data.AccessToken;
      console.log("Your access token is: " + AccessToken);
      params = 'Emby UserId="' + id + '", Client="Netcast", Device="' + modelName + '", DeviceId="' + serialNumber + '", Version="1.0.0.0"';
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
