var shows = {}

function getShowCard(i) {
    var item = shows[i]
    var show_html =
        "<div class='item' onClick='loadShow(" + i + ")'>" +
            "<img src='" + userinfo.host + "/Items/" + item.Id + "/Images/Primary' width=180 height=270>" +
            "<div class='text'>" + item.Name + "</div>" +
        "</div>"
    return show_html
}

function getSeasonCard(item) {
    var season_html =
        "<div id='" + item.Id + "'  class='item' onClick='loadEpisodes(this.id)'>" +
            "<img src='" + userinfo.host + "/Items/" + item.SeriesId + "/Images/Primary' width=180 height=270>" +
            "<div class='text'>" + item.Name + "</div>" +
        "</div>"
    return season_html
}

function getEpisodeCard(item) {
    var episode_html =
        "<div id='" + item.Id + "'  class='item' onClick='getItemDetails(this.id)'>" +
            "<img src='" + userinfo.host + "/Items/" + item.Id + "/Images/Primary' width=400 height=225>" +
            "<div class='text'>" + item.Name + "</div>" +
        "</div>"
    return episode_html
}

function loadTVShows(library_id) {
    cleanup("shows")
    loadJSON("/Users/" + userinfo.id + "/Items?ParentId=" + library_id + "&SortBy=SortName", "GET",
        function (data) {
            shows = data.Items
            for (var i = 0; i < shows.length; i++) {
                document.getElementById("shows").insertAdjacentHTML("beforeend", getShowCard(i));
            }
            parent.location.hash = "#shows";
        },
        function (xhr) {
            showToast(xhr.response)
        }
    );
}

function loadShow(i) {
    cleanup("showinfo")
    cleanup("seasons")
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
            for (i = 0; i < items.length; i++) {
                console.log(i + " " + items[i].Name);
                document.getElementById("seasons").insertAdjacentHTML("beforeend", getSeasonCard(items[i]));
            }
        },
        function (xhr) {
            showToast(xhr.response)
        }
    );
}

function loadEpisodes(content_id) {
    cleanup("episodes")
    loadJSON("/Users/" + userinfo.id + "/Items?ParentId=" + content_id + "&SortBy=SortName", "GET",
        function (data) {
            console.log(data)
            var items = data.Items
            for (i = 0; i < items.length; i++) {
                console.log(i + " " + items[i].Name);
                document.getElementById("episodes").insertAdjacentHTML("beforeend", getEpisodeCard(items[i]));
            }
        },
        function (xhr) {
            showToast(xhr.response)
        }
    );
    parent.location.hash = "#episodes";
}
