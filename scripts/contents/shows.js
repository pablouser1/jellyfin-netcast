var shows = {}
function getShowCard(i) {
    var item = shows[i]
    var show_html =
        "<div class='item' onClick='loadShow(" + i + ")'>" +
            "<img src='" + host + "/Items/" + item.Id + "/Images/Primary' width=180 height=270>" +
            "<div class='text'>" + item.Name + "</div>" +
        "</div>"
    return show_html
}

function getSeasonCard(item) {
    var season_html =
        "<div id='" + item.Id + "'  class='item' onClick='loadEpisodes(this.id)'>" +
            "<img src='" + host + "/Items/" + item.SeriesId + "/Images/Primary' width=180 height=270>" +
            "<div class='text'>" + item.Name + "</div>" +
        "</div>"
    return season_html
}

function getEpisodeCard(item) {
    var episode_html =
        "<div id='" + item.Id + "'  class='item' onClick='startVideo(this.id)'>" +
            "<img src='" + host + "/Items/" + item.Id + "/Images/Primary' width=400 height=225>" +
            "<div class='text'>" + item.Name + "</div>" +
        "</div>"
    return episode_html
}

function loadTVShows(library_id) {
    cleanup("shows")
    loadJSON(host + "/Users/" + userinfo.id + "/Items?ParentId=" + library_id + "&SortBy=SortName", "GET",
        function (data) {
            shows = data.Items
            for (var i = 0; i < shows.length; i++) {
                document.getElementById("shows").insertAdjacentHTML("beforeend", getShowCard(i));
            }
            parent.location.hash = "#shows";
        },
        function (xhr) {
            console.error(xhr);
        }
    );
}

function loadShow(id) {
    cleanup("showinfo")
    cleanup("seasons")
    getShowInfo(id)
    loadSeasons(id)
    parent.location.hash = "#show";
}

function getShowInfo(id) {
    var show = shows[id]
    loadJSON(host + "/Users/" + userinfo.id + "/Items/" + show.Id, "GET",
        function (data) {
            // -- BANNER -- //
            var banner_img = host + "/Items/" + data.Id + "/Images/Primary?maxWidth=1920&tag=" + data.ImageTags.Primary + "&quality=90"
            document.getElementById("heroimg").src = banner_img

            // Title
            document.getElementById("show_title").innerHTML = data.Name
            document.getElementById("showinfo").innerHTML = data.Overview
        },
        function (xhr) {
            console.error(xhr);
        }
    );
}

function loadSeasons(id) {
    var show = shows[id]
    loadJSON(host + "/Users/" + userinfo.id + "/Items?ParentId=" + show.Id + "&SortBy=SortName", "GET",
    function (data) {
        var items = data.Items
        for (i = 0; i < items.length; i++) {
            console.log(i + " " + items[i].Name);
            document.getElementById("seasons").insertAdjacentHTML("beforeend", getSeasonCard(items[i]));
        }
    },
    function (xhr) {
        console.error(xhr);
    }
);
}

function loadEpisodes(content_id) {
    cleanup("episodes")
    loadJSON(host + "/Users/" + userinfo.id + "/Items?ParentId=" + content_id + "&SortBy=SortName", "GET",
        function (data) {
            console.log(data)
            var items = data.Items
            for (i = 0; i < items.length; i++) {
                console.log(i + " " + items[i].Name);
                document.getElementById("episodes").insertAdjacentHTML("beforeend", getEpisodeCard(items[i]));
            }
        },
        function (xhr) {
            console.error(xhr);
        }
    );
    parent.location.hash = "#episodes";
}
