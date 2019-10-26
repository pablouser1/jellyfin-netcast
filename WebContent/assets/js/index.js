useheaders = 0;
device = document.getElementById("device");
serialNumber = device.serialNumber;
modelName = device.modelName;
var AccessToken;
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
    if (useheaders === 1){
      console.log(user_global);
      xhr.setRequestHeader("Authorization", text);
      xhr.setRequestHeader("Content-Type", "application/json");
      if (AccessToken != null ){
        xhr.setRequestHeader("X-MediaBrowser-Token", AccessToken);
      }
      xhr.send(params);
    }
    else {
    xhr.send();
  }
}

function generate_token(length){
    //edit the token allowed characters
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}
//Show or hide div elements
function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

function login(){
  ip = document.getElementById("ip").value;

  port = document.getElementById("port").value;

  whole_url = "http://" + ip + ":" + port;
  show ('login', false);
  show ('users', true);
  loadJSON(whole_url + "/emby/Users/Public", "GET", "true",
    function(data) {
      var i = 0;
      while (i < data.length) {
          console.log(i + " " + data[i].Name);
          document.getElementById("users").innerHTML = "<a href='javascript:user(" + '"'  + data[i].Name + '"' + ");'>" + "<img src=assets/images/menus/user_icon.png width='152' height='152' id=" + "'" + data[i].Name + "'" +"</a>";
          i++;
      }
    },
    function(xhr) {
        console.error(xhr);
        show('login', true);
        show('users', false);
        alert("There was an error trying to connect to the server");
    }
);
}

function user(username){
  user_global= username;
  //Get User's ID
  loadJSON(whole_url + "/emby/Users/Public", "GET", "true",
      function(data) {
        var i = 0;
        while (i < data.length) {
            console.log(i + " " + data[i].Name);
            if (data[i].Name === username){
              id = data[i].Id;
            }
            i++;
        }
          console.log("Your user ID is: " + id);
          show('users', false);
          show('passwd', true);
      },
      function(xhr) {
          console.error(xhr);
      }
  );

}

function passwd(){
  passwd = document.getElementById("password").value;
  useheaders = 1;
  params ='{ "Username":' + user_global + ', "Pw":' + passwd + '}';
  text = 'Emby UserId="'+ id + '", Client="Netcast", Device="' + modelName + '", DeviceId="' + serialNumber + '", Version="1.0.0.0", Token="' + token + '"';
  loadJSON(whole_url + "/emby/Users/authenticatebyname", "POST", "false",
      function(data) {
        AccessToken = data.AccessToken;
        console.log("Your access token is:" + AccessToken);
        show ('passwd', 'false');
        show ('content', 'true');
      },
      function(xhr) {
          console.error(xhr);
      }
  );

}
function content(clicked_id) {
    content_type = clicked_id;

    show('content', false);
    show('items', true);
    show('top', true);

    console.log("Button clicked: " + clicked_id);
    if (clicked_id === "movies_img") {
        getmovies();
    } else if (clicked_id === "tv_img") {
        gettv();
    } else if (clicked_id === "music_img") {
        getmusic();
    } else {
        alert("I don't know which button you clicked");
    }
}

function getmovies() {
    loadJSON(whole_url + "/emby/Users/" + id + "/Items?Recursive=true&IncludeItemTypes=Movie", "GET", "true",
        function(data) {
            movies = data;
            var i = 0;
            while (i < data.Items.length) {
                console.log(i + " " + data.Items[i].Name);
                document.getElementById("items").innerHTML += "<a href='javascript:videoplayer(movies.Items[" + i + "].Id)''>" + "<img src=" + whole_url + "/emby/Items/" + data.Items[i].Id + "/Images/Primary width=180 height=270>";
                i++;
            }
        },
        function(xhr) {
            console.error(xhr);
        }
    );
}

function gettv() {
    loadJSON(whole_url + "/emby/Users/" + id + "/Items?Recursive=true&CollectionType=tvshows&includeItemTypes=Series&SortBy=SortName", "GET", "true",
        function(data) {
            tv = data;
            var i = 0;
            while (i < data.Items.length) {
                console.log(i + " " + data.Items[i].Name);
                document.getElementById("items").innerHTML += "<a href='javascript:videoplayer(tv.Items[" + i + "].Id)''>" + "<img src=" + whole_url + "/emby/Items/" + data.Items[i].Id + "/Images/Primary width=180 height=270>";
                i++;
            }
        },
        function(xhr) {
            console.error(xhr);
        }
    );
}

function getmusic() {
    loadJSON(whole_url + "/emby/Users/" + id + "/Items?Recursive=true&CollectionType=music&includeItemTypes=Audio&SortBy=SortName", "GET", "true",
        function(data) {
            music = data;
            var i = 0;
            while (i < data.Items.length) {
                console.log(i + " " + data.Items[i].Name);
                document.getElementById("items").innerHTML += "<a href='javascript:videoplayer(music.Items[" + i + "].Id)''>" + "<img src=" + whole_url + "/emby/Items/" + data.Items[i].Id + "/Images/Primary width=270 height=270>" + data.Items[i].Name;
                i++;
            }
        },
        function(xhr) {
            console.error(xhr);
        }
    );
}

function videoplayer(id_item) {
    console.log(id_item);
    show('items', false);
    show('playerLayout', true);

}
