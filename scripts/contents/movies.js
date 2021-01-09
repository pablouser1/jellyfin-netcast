var movies = {}

function getMovieCard(item) {
    var show_html =
        "<div id='" + item.Id + "' class='item' onClick='getItemDetails(this.id)' tabindex='-1'>" +
            "<img src='" + getPrimaryImage(item.Id) + "' width=180 height=270>" +
            "<div class='text'>" + item.Name + "</div>" +
        "</div>"
    return show_html
}

function loadMovies(library_id) {
    loadJSON("/Users/" + userinfo.id + "/Items?ParentId=" + library_id + "&SortBy=SortName", "GET",
        function (data) {
            movies = data.Items
            var movies_html = ""
            for (var i = 0; i < movies.length; i++) {
                movies_html += getMovieCard(movies[i])
            }
            document.getElementById("movies").innerHTML = movies_html
            parent.location.hash = "#movies";
        },
        function (xhr) {
            console.error(xhr);
        }
    );
}
