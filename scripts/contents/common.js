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
