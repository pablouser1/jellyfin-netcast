function cleanup(type) {
    // Clear HTML from divs
    switch (type) {
        case "movies":
        case "shows":
        case "showinfo":
        case "seasons":
        case "episodes":
        case "music":
            document.getElementById(type).innerHTML = ""
            break
    }
}

// Scroll left or right
function moveTo(box, direction) {
    var el = '#' + box
    if (direction == "left") {
        var offset = -$(el).offset().left
    }
    else {
        var offset = $(el).offset().left
    }
    $(el).animate({scrollLeft: offset}, 800);
}
