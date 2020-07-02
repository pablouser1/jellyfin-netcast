var AccessToken;
var loggedin;

function checkserver() {
  //Store login info
  host = document.getElementById("host_input").value;

  // A ping, kinda. Just to make sure that the server is alive
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", host + "/Users/Public", false);
  try {
    xhttp.send();
    $(".host-box").hide();
    $(".user-box").show();
  } catch (NetworkError) {
    alert("Error")
  }
}

function user() {
  //Store user info
  username = document.getElementById("username_input").value;
  passwd = document.getElementById("password_input").value;
  
  //Set headers. (Probably there's a better way to do this)
  params = 'Mediabrowser Client="Netcast", Device="' + modelName + '", DeviceId="' + serialNumber + '", Version="1.0.0"';
  loadJSON(host + "/Users/authenticatebyname", "POST",
    function (data) {
      AccessToken = data.AccessToken;
      params = 'Mediabrowser Client="Netcast", Device="' + modelName + '", DeviceId="' + serialNumber + '", Version="1.0.0", Token="' + AccessToken + '"';
      loggedin = 1;
      console.log("Your access token is: " + AccessToken);

      // Get user ID
      loadJSON(host + "/Users", "GET",
        function (data) {
          for (i = 0; i < data.length; i++) {
            console.log(i + " " + data[i].Name);
            if (data[i].Name === username) {
              id = data[i].Id;
            }
          }
          console.log("Your user ID is: " + id);
          // Show library
          showlibrary();
          $(".user-box").hide();
          $("#content").show();
          $(".topnav").show();
          $("#watching").show();
        },
        function (xhr) {
          console.error(xhr);
          alert("There was an error while trying to retrieve your user id");
        }
      );
    },
    function (xhr) {
      console.error(xhr);
    }
  );
  parent.location.hash = "#main_menu";
}