function getMusicCard(item) {
    var music_html =
    "<div id='" + item.Id + "' class='item' onClick='startMusic(this.id)'>" +
        "<img src='" + host + "/Items/" + item.Id + "/Images/Primary' width=180 height=180>" +
        "<div class='text'>" + item.Name + "</div>" +
    "</div>"
    return music_html
}

function loadMusic(library_id) {
    cleanup("music")
    loadJSON(host + "/Users/" + userinfo.id + "/Items?ParentId=" + library_id + "&SortBy=SortName", "GET",
        function (data) {
            var items = data.Items
            for (var i = 0; i < items.length; i++) {
                document.getElementById("music").insertAdjacentHTML("beforeend", getMusicCard(items[i]));
            }
            parent.location.hash = "#music";
        },
        function (xhr) {
            console.error(xhr);
        }
    );
}
