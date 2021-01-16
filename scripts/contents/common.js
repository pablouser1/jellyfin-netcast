// Selected item, ready to be played
var selected_item = {
    Id: "",
    Name: "",
    Overview: "",
    MediaSources: []
}

function getPrimaryImage(id) {
    return (userinfo.host + "/Items/" + id + "/Images/Primary?maxHeight=710&maxWidth=710&quality=90")
}

/**
 * Get item container, video, audio, subtitle
 * @param {number} id Id of item
 */
function getItemDetails(id) {
    loadJSON("/Users/" + userinfo.id + "/Items/" + id, "GET",
        function (data) {
            selected_item.Id = data.Id
            selected_item.Name = data.Name
            selected_item.Overview = data.Overview
            // Get all media sources (usually only 1)
            var stream_container = document.getElementById("stream_container")
            stream_container.innerHTML = ""
            for (var i = 0; i < data.MediaSources.length; i++) {
                var currentSource = data.MediaSources[i]
                // Create options
                createOption(currentSource.Name, i, stream_container)
                var MediaStreams = {
                    Video: [],
                    Audio: [],
                    Subtitle: []
                }
                // Get all streams (Video, Audio, Subtitle)
                for (var j = 0; j < currentSource.MediaStreams.length; j++) {
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
            document.getElementById("itemname").innerHTML = selected_item.Name
            if (selected_item.Overview) {
                document.getElementById("iteminfo").innerHTML = selected_item.Overview
            }
        },
        function (error) {
            showToast(error)
        }
    )
    parent.location.hash = "details"
}

function swapContainers() {
    var container_val = document.getElementById("stream_container").value
    console.log(container_val)
    var mediaStreams = selected_item.MediaSources[container_val].streams
    if (mediaStreams.Video) {
        console.log("Loading videos")
        var videoContainer = document.getElementById("stream_video")
        videoContainer.innerHTML = ""
        loopStreams(mediaStreams.Video, videoContainer)
    }
    if (mediaStreams.Audio) {
        console.log("Loading audios")
        var audioContainer = document.getElementById("stream_audio")
        audioContainer.innerHTML = ""
        loopStreams(mediaStreams.Audio, audioContainer)
    }
    if (mediaStreams.Subtitle) {
        console.log("Loading subtitles")
        var subtitleContainer = document.getElementById("stream_subtitle")
        subtitleContainer.innerHTML = ""
        loopStreams(mediaStreams.Subtitle, subtitleContainer)
    }
}

function loopStreams(streams, container) {
    for (var i = 0; i < streams.length; i++) {
        var stream = streams[i]
        var displayTitle = stream.displayTitle
        var index = stream.index
        createOption(displayTitle, index, container)
    }
}

function createOption(text, value, container) {
    // Create options
    var o = new Option(text, value);
    o.innerHTML = text
    container.appendChild(o)
}
