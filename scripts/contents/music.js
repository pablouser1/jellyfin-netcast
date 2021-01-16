function getMusicCard(item) {
    var music_html =
    "<div id='" + item.Id + "' class='item' onClick='startMusic(this.id)' tabindex='-1'>" +
        "<img src='" + getPrimaryImage(item.Id) + "' width=180 height=180>" +
        "<div class='text'>" + item.Name + "</div>" +
    "</div>"
    return music_html
}

function loadMusic(library_id) {
    loadJSON("/Users/" + userinfo.id + "/Items?ParentId=" + library_id + "&SortBy=SortName", "GET",
        function (data) {
            var items = data.Items
            var music_html = ""
            for (var i = 0; i < items.length; i++) {
                music_html += getMusicCard(items[i])
            }
            document.getElementById("music").innerHTML = music_html
            parent.location.hash = "music";
        },
        function (xhr) {
            console.error(xhr);
        }
    );
}
