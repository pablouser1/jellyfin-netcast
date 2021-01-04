var shows = {}
function getShowCard(i) {
    var item = shows[i]
    var show_html =
        "<div class='img_container'>" +
            "<img class='img_items' src='" + host + "/Items/" + item.Id + "/Images/Primary'" +
                "width=180 height=270 onClick='loadShow(`" + i + "`)'</img>" +
            "<div class='text'>" + item.Name + "</div>" +
        "</div>"
    return show_html
}

function getSeasonCard(item) {
    var season_html = "<img class='img_items' src='" + host + "/Items/" + item.SeriesId + "/Images/Primary'" +
        "width=180 height=270 onClick='loadEpisodes(`" + item.Id + "`);'</img>"
    return season_html
}

function getEpisodeCard(item) {
    var episode_html = "<img class='img_items' src='" + host + "/Items/" + item.Id + "/Images/Primary'" +
        "width=400 height=225 onClick='startVideo(`" + item.Id + "`);'</img>"
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
            var banner_img = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('" + host + "/Items/" + data.Id + "/Images/Primary?maxWidth=1920&tag=" + data.ImageTags.Primary + "&quality=90')"
            document.getElementById("showbanner").style.backgroundImage = banner_img

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
        console.log(items)
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