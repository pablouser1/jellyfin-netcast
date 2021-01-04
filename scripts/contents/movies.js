function getMovieCard(item) {
    var show_html =
        "<img id='" + item.Id +
        "' src='" + host + "/Items/" + item.Id + "/Images/Primary'" +
        "class='img_items' width=180 height=270 onClick='startVideo(`" + item.Id + "`)'</img>"

    return show_html
}

function loadMovies(library_id) {
    cleanup("movies")
    loadJSON(host + "/Users/" + userinfo.id + "/Items?ParentId=" + library_id + "&SortBy=SortName", "GET",
        function (data) {
            var items = data.Items
            for (var i = 0; i < items.length; i++) {
                document.getElementById("movies").insertAdjacentHTML("beforeend", getMovieCard(items[i]));
            }
            parent.location.hash = "#movies";
        },
        function (xhr) {
            console.error(xhr);
        }
    );
}
