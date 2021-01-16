function startWebSocket() {
    var socketURL = userinfo.host.replace(/(http)(s)?\:\/\//, "ws$2://");
    var socket = new WebSocket(socketURL + "/socket?api_key=" + userinfo.token + "&deviceId=" + device.serialNumber)
    // Log messages from the server
    socket.onmessage = function (e) {
        var message = JSON.parse(e.data)
        console.log(message)
        switch (message.MessageType) {
            case "ForceKeepAlive":
                setInterval(sendKeepAlive, message.Data * 1000);
                break
            case "GeneralCommand":
                handleGeneralCommand(message.Data)
                break
            case "Play":
                getPlaybackInfo(message.Data.MediaSourceId, message.Data.AudioStreamIndex, message.Data.SubtitleStreamIndex)
                break
            case "Playstate":
                // TODO
                handlePlaystate(message.Data)
                break          
        }
    };
}

function sendKeepAlive() {
    console.log("Sending keep alive to server")
    socket.send('{"MessageType":"KeepAlive"}')
}

function handleGeneralCommand(message) {
    switch (message.Name) {
        case "MoveUp":
            SpatialNavigation.move("up")
            break
        case "MoveDown":
            SpatialNavigation.move("down")
            break
        case "MoveLeft":
            SpatialNavigation.move("left")
            break
        case "MoveRight":
            SpatialNavigation.move("right")
            break
        case "Select":
            document.activeElement.click()
            break
        case "Back":
            goBack()
            break
        case "GoHome":
            parent.location.hash = "home"
            break
        case "DisplayContent":
            handleDisplayContent(message)
            break
        case "DisplayMessage":
            showToast("Message from server: " + message.Arguments.Header + "<br>" + message.Arguments.Text)
            break
    }
}

function handleDisplayContent(message) {
    switch (message.Arguments.ItemType) {
        case "CollectionFolder":
            loadJSON("/Users/" + userinfo.id + "/Items/" + message.Arguments.ItemId, "GET",
                function (data) {
                    switch (data.CollectionType) {
                        case "tvshows":
                            loadTVShows(data.Id)
                            break
                        case "movies":
                            loadMovies(data.Id)
                            break
                        case "music":
                            loadMusic(data.Id)
                            break
                        default:
                            showToast("Content not supported")
                    }
                },
                function (xhr) {
                    showToast(xhr.response)
                }
            );
            break
        case "Series":
            loadShow(message.Arguments.ItemId)
            break
        case "Season":
            loadEpisodes(message.Arguments.ItemId)
            break
        case "Episode":
            getItemDetails(message.Arguments.ItemId)
            break
    }
}

function handlePlaystate(message) {
    switch (message.Command) {
        case "PlayPause":
            togglePlayPause()
            break
        case "Seek":
            video.seek(message.SeekPositionTicks / 10000)
            break
    }
}
