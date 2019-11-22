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
