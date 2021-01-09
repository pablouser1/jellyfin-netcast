var shows = {}

function getShowCard(i) {
    var item = shows[i]
    var show_html =
        "<div class='item' onClick='loadShow(" + i + ")' tabindex='-1'>" +
            "<img src='" + getPrimaryImage(item.Id) + "' width=180 height=270>" +
            "<div class='text'>" + item.Name + "</div>" +
        "</div>"
    return show_html
}

function getSeasonCard(item) {
    var season_html =
        "<div id='" + item.Id + "'  class='item' onClick='loadEpisodes(this.id)' tabindex='-1'>" +
            "<img src='" + getPrimaryImage(item.SeriesId) + "' width=180 height=270>" +
            "<div class='text'>" + item.Name + "</div>" +
        "</div>"
    return season_html
}

function getEpisodeCard(item) {
    var episode_html =
        "<div id='" + item.Id + "'  class='item' onClick='getItemDetails(this.id)' tabindex='-1'>" +
            "<img src='" + getPrimaryImage(item.Id) + "' width=400 height=225>" +
            "<div class='text'>" + item.Name + "</div>" +
        "</div>"
    return episode_html
}

function loadTVShows(library_id) {
    loadJSON("/Users/" + userinfo.id + "/Items?ParentId=" + library_id + "&SortBy=SortName", "GET",
        function (data) {
            shows = data.Items
            var shows_html = ""
            for (var i = 0; i < shows.length; i++) {
                shows_html += getShowCard(i)
            }
            document.getElementById("shows").innerHTML = shows_html
            parent.location.hash = "#shows";
        },
        function (xhr) {
            showToast(xhr.response)
        }
    );
}

function loadShow(i) {
    getShowInfo(i)
    loadSeasons(i)
    parent.location.hash = "#show";
}

function getShowInfo(i) {
    var show = shows[i]
    loadJSON("/Users/" + userinfo.id + "/Items/" + show.Id, "GET",
        function (data) {
            // Info
            document.getElementById("show_title").innerHTML = data.Name
            document.getElementById("showinfo").innerHTML = data.Overview
        },
        function (xhr) {
            showToast(xhr.response)
        }
    );
}

function loadSeasons(i) {
    var show = shows[i]
    loadJSON("/Shows/" + show.Id + "/Seasons?userid=" + userinfo.id, "GET",
        function (data) {
            var items = data.Items
            var seasons_html = ""
            for (i = 0; i < items.length; i++) {
                seasons_html += getSeasonCard(items[i])
            }
            document.getElementById("seasons").innerHTML = seasons_html
        },
        function (xhr) {
            showToast(xhr.response)
        }
    );
}

function loadEpisodes(content_id) {
    loadJSON("/Users/" + userinfo.id + "/Items?ParentId=" + content_id + "&SortBy=SortName", "GET",
        function (data) {
            var items = data.Items
            var episodes_html = ""
            for (i = 0; i < items.length; i++) {
                episodes_html += getEpisodeCard(items[i])
            }
            document.getElementById("episodes").innerHTML = episodes_html
        },
        function (xhr) {
            showToast(xhr.response)
        }
    );
    parent.location.hash = "#episodes";
}
