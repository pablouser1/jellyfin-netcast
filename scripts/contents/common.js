// Selected item, ready to be played
var selected_item = {}

function getPrimaryImage(id) {
    return (userinfo.host + "/Items/" + id + "/Images/Primary")
}

function getItemDetails(id) {
    loadJSON("/Users/" + userinfo.id + "/Items/" + id, "GET",
    function(data) {
        selected_item = {
            Id: data.Id,
            Name: data.Name,
            Overview: data.Overview,
            MediaSources: []
        }
        // Get all media sources (usually only 1)
        for (var i=0; i< data.MediaSources.length; i++) {
            var currentSource = data.MediaSources[i]
            // Create options
            createOption(currentSource.Name, i, "#stream_container")
            var MediaStreams = {
                "Video": [],
                "Audio": [],
                "Subtitle": []
            }
            // Get all streams (Video, Audio, Subtitle)
            for (var j=0; j<currentSource.MediaStreams.length; j++) {
                var currentStream = currentSource.MediaStreams[j]
                MediaStreams[currentStream.Type].push({
                    displayTitle: currentStream.DisplayTitle,
                    index: currentStream.Index
                })
            }
            // Push to array
            selected_item.MediaSources.push({
                Id: currentSource.Id,
                tag: currentSource.ETag,
                fileName: currentSource.Name,
                streams: MediaStreams 
            })
        }
        swapContainers()
        console.log(selected_item)
        document.getElementById("itemname").innerHTML = selected_item.Name
        if (selected_item.Overview) {
            document.getElementById("iteminfo").innerHTML = selected_item.Overview
        }
    },
    function(error) {
        showToast(error)
    }
    )
    parent.location.hash = "details"
}

function swapContainers() {
    var container = document.getElementById("stream_container").value
    var mediaStreams = selected_item.MediaSources[container].streams
    if (mediaStreams.Video) {
        console.log("Loading videos")
        loopStreams(mediaStreams.Video, "#stream_video")
    }
    if (mediaStreams.Audio) {
        console.log("Loading audios")
        loopStreams(mediaStreams.Audio, "#stream_audio")
    }
    if (mediaStreams.Subtitle) {
        console.log("Loading subtitles")
        loopStreams(mediaStreams.Subtitle, "#stream_subtitle")
    }
}

function loopStreams(streams, container) {
    for (var i=0; i< streams.length; i++) {
        var stream  = streams[i]
        var displayTitle = stream.displayTitle
        var index = stream.index
        createOption(displayTitle, index, container)
    }
}

function createOption(text, value, container) {
    // Create options
    var o = new Option(text, value);
    /// jquerify the DOM object 'o' so we can use the html method+
    o.innerHTML = text
    document.getElementById(container).append(o)
}
