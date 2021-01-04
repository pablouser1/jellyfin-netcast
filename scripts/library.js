var library = {}

function prepareLibrary() {
  $("#topnav").show();
  showLibrary()
  showRecent()
}

function showLibrary() {
  //Get all libraries and display them, with their respective image.
  loadJSON(host + "/Users/" + userinfo.id + "/Views", "GET",
    function (data) {
      library = data.Items
      for (i = 0; i < data.Items.length; i++) {
        console.log(i + " " + data.Items[i].Name);
        $(content_table).find("tbody").append("<td><img id='" + data.Items[i].UserData.Key + "' class='img_items' src='" + host + "/Items/" + data.Items[i].Id + "/Images/Primary' width=355 height=200 onClick='loadContent(" + i + ");'</td>");
        $(content_table).find("tfoot").append("<td>" + data.Items[i].Name + "</td>");
      }
    },
    function (xhr) {
      console.error(xhr);
    }
  );
}

function showRecent() {
  //Get all continue watching and display them, with their respective image.
  loadJSON(host + "/Users/" + userinfo.id + "/Items?Limit=20&Recursive=true&SortBy=DatePlayed&SortOrder=Descending&Filters=IsResumable", "GET",
    function (data) {
      for (i = 0; i < data.Items.length; i++) {
        console.log(i + " " + data.Items[i].Name);
        $("#watching_table").find("tbody").append("<td><img src='" + host + "/Items/" + data.Items[i].Id + "/Images/Primary' width=355 height=200</td>");
        $("#watching_table").find("tfoot").append("<td>" + data.Items[i].SeriesName + " - " + data.Items[i].Name + "</td>");
      }
    },
    function (xhr) {
      console.error(xhr);
    }
  );
}

function loadContent(content_id) {
  var library_id = library[content_id].Id
  switch (library[content_id].CollectionType) {
    case "tvshows":
      loadTVShows(library_id)
      break
    case "movies":
      loadMovies(library_id)
      break
    case "music":
      loadMusic(library_id)
      break
    default:
      console.error("Library not found")
  }
}
