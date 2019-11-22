var useheaders = 0;
var device = document.getElementById("device");
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

function login() {
    //Store login info
    ip = document.getElementById("ip").value;
    port = document.getElementById("port").value;
    whole_url = ip + ":" + port;
    document.cookie = "login=" + whole_url;
    //Get all users and show them.
    loadJSON(whole_url + "/jellyfin/Users/Public", "GET", "true",
        function(data) {
            $("#login").hide();
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
            $("#password").show();
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
            $("#password").hide();
            $("#content").show();
        },
        function(xhr) {
            console.error(xhr);
        }
    );

}

function content(clicked_id) {
    content_type = clicked_id;

    $("#content").hide();
    $("#items").show();

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
    window.NetCastSetPageLoadingIcon('enabled');
    loadJSON(whole_url + "/jellyfin/Users/" + id + "/Items?Recursive=true&IncludeItemTypes=Movie", "GET", "true",
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
    window.NetCastSetPageLoadingIcon('disabled');
}

function gettv() {
    window.NetCastSetPageLoadingIcon('enabled');
    loadJSON(whole_url + "/jellyfin/Users/" + id + "/Items?Recursive=true&CollectionType=tvshows&includeItemTypes=Series&SortBy=SortName", "GET", "true",
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
    window.NetCastSetPageLoadingIcon('disabled');
}

function getmusic() {
    loadJSON(whole_url + "/jellyfin/Users/" + id + "/Items?Recursive=true&CollectionType=music&includeItemTypes=Audio&SortBy=SortName", "GET", "true",
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
    $("#items").hide();
    $("#videoplayer").show();
    console.log(app);
    app.createVideoPlayer($("#videoplayer"), true, whole_url + "/jellyfin/Videos/" + id_item + '/stream.mp4');
    app.play();
}
