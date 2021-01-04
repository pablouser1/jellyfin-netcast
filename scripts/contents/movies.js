var movies = {}

function getMovieCard(item) {
    var show_html =
    "<div id='" + item.Id + "' class='item' onClick='loadMovieInfo(" + i + ")'>" +
        "<img src='" + host + "/Items/" + item.Id + "/Images/Primary'" +
        "width=180 height=270</img>" +
        "<div class='text'>" + item.Name + "</div>" +
    "</div>"

    return show_html
}

function loadMovies(library_id) {
    cleanup("movies")
    loadJSON(host + "/Users/" + userinfo.id + "/Items?ParentId=" + library_id + "&SortBy=SortName", "GET",
        function (data) {
            movies = data.Items
            for (var i = 0; i < movies.length; i++) {
                document.getElementById("movies").insertAdjacentHTML("beforeend", getMovieCard(movies[i]));
            }
            parent.location.hash = "#movies";
        },
        function (xhr) {
            console.error(xhr);
        }
    );
}

// WIP, movie info. For now it just redirects to player
function loadMovieInfo(i) {
    var movie = movies[i]
    startVideo(movie.Id)
}
