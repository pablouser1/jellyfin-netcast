var library = {}

function getLibraryCard(i) {
  var item = library[i]
  var library_html =
    "<div class='item' onclick='loadContent(" + i + ")'>" +
      "<img src='" + userinfo.host + "/Items/" + item.Id + "/Images/Primary' width=355 height=200</img>" +
      "<div class='text'>" + item.Name + "</div>" +
    "</div>"
  return library_html
}

function getRecentCard(item) {
  var recent_html =
    "<div id='" + item.Id + "' class='item' onclick='startVideo(this.id)'>" +
      "<img src='" + userinfo.host + "/Items/" + item.Id + "/Images/Primary' width=355 height=200>" +
      "<div class='text'>" + item.SeriesName + " - " + item.Name + "</div>" +
    "</div>"
  return recent_html
}

function prepareLibrary() {
  $("#navbar").show();
  showLibrary()
  showRecent()
}

function showLibrary() {
  //Get all libraries and display them, with their respective image.
  loadJSON("/Users/" + userinfo.id + "/Views", "GET",
    function (data) {
      library = data.Items
      for (i = 0; i < data.Items.length; i++) {
        document.getElementById("library").insertAdjacentHTML("beforeend", getLibraryCard(i));
      }
    },
    function (xhr) {
      console.error(xhr);
    }
  );
}

function showRecent() {
  //Get all continue watching and display them, with their respective image.
  loadJSON("/Users/" + userinfo.id + "/Items?Limit=20&Recursive=true&SortBy=DatePlayed&SortOrder=Descending&Filters=IsResumable", "GET",
    function (data) {
      for (i = 0; i < data.Items.length; i++) {
        document.getElementById("watching").insertAdjacentHTML("beforeend", getRecentCard(data.Items[i]));
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
      showToast("Content not supported")
  }
}
