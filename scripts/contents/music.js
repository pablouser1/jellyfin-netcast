function getMusicCard(item) {
    var show_html =
        "<img id='" + item.Id +
        "' src='" + host + "/Items/" + item.Id + "/Images/Primary'" +
        "class='img_items' width=180 height=180 onClick='startMusic(`" + item.Id + "`)'</img>"

    return show_html
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
