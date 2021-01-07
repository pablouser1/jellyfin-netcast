// Video
var video = document.getElementById("video");
var progressInterval;
var playingInterval;
var playback = {
   localinfo: {},
   currentState: {}
}

function getPlaybackInfo() {
   var mediaSourceIndex = $("#stream_container").val()
   var mediaSourceId = selected_item.MediaSources[mediaSourceIndex].Id
   var audioIndex = ($("#stream_audio").val() ? $("#stream_audio").val() : -1)
   var subtitleIndex = ($("#stream_subtitle").val() ? $("#stream_subtitle").val() : -1)
   loadJSON("/Items/" + selected_item.Id + "/PlaybackInfo?UserId=" + userinfo.id + "&MediaSourceId=" + mediaSourceId + "&IsPlayback=true&AutoOpenLiveStream=true&StartTimeTicks=" + /* TODO, GET START TIME TICKS */ "0" + "&AudioStreamIndex=" + audioIndex + "&SubtitleStreamIndex=" + subtitleIndex + "&MaxStreamingBitrate=59786477", "POST",
   function(data) {
      // Choose between methods
      var mediaSource = data.MediaSources[mediaSourceIndex]
      // Direct play (ideal)
      if (mediaSource.SupportsDirectPlay) {
         playback.localinfo.playMethod = "DirectPlay"
         playback.localinfo.url = userinfo.host + "/Videos/" + mediaSource.Id + "/stream." + mediaSource.Container + "?static=true&mediaSourceId=" + selected_item.MediaSources[0].Id + "&deviceId=" + device.serialNumber + "&api_key=" + userinfo.token + "&Tag=" + mediaSource.ETag
      }
      // Direct stream
      else if (mediaSource.SupportsDirectStream) {
         playback.localinfo.playMethod = "DirectStream"
         playback.localinfo.url = "" // TODO
      }
      // Transcoding
      else {
         playback.localinfo.playMethod = "Transcode"
         playback.localinfo.url = mediaSource.TranscodingUrl
      }
      // Set currentState
      playback.currentState = {
         "IsMuted": false,
         "IsPaused": false,
         "RepeatMode": "RepeatNone",
         "ShuffleMode": "Sorted",
         "PlayMethod": playback.localinfo.playMethod,
         "PlaySessionId": "",
         "PlaylistItemId": "playlistItem0",
         "MediaSourceId": mediaSourceId,
         "CanSeek": true,
         "ItemId": selected_item.Id
      }
      startVideo()
   },
   function(error) {
      showToast(error)
   }, JSON.stringify({"DeviceProfile": device_profile.DeviceProfile}))
}

// Start video with playback data
function startVideo() {
   notifyPlaying()
   video.width = selected_item.Width
   video.height = selected_item.Height
   parent.location.hash = "#player";
   $("#navbar").hide();
   video.data = playback.localinfo.url;
   video.play();
   video.onPlayStateChange = processPlayState;
   progressInterval = setInterval(updateProgressBar, 1000);
   playingInterval = setInterval(notifyProgress("TimeUpdate"), 10000)
}

// Close player when finished
function processPlayState() {
   if (video.playState === 5) {
      stopPlayer()
   }
}

// Play / Pause
function togglePlayPause() {
   var btn = document.getElementById('play-pause-button');
   // 1: Is playing, 2: Is paused, 3: Connecting, 4: Buffering, 5: Finished, 6: Error
   if (video.playState === 1) {
      btn.innerText = '►';
      video.pause();
      notifyProgress("pause")
   }
   else if (video.playState === 2) {
      btn.innerText = '❙❙';
      video.play();
      notifyProgress("unpause")
   }
}

// Stop all player functions
function stopPlayer() {
   // Send sever stop request
   notifyStopPlaying()
   // Reset values
   video.onPlayStateChange = undefined
   video.pause();
   video.currentTime = 0;
   video.data = ''
   clearInterval(progressInterval)
   clearInterval(playingInterval)
   playback = {
      localinfo: {},
      currentState: {}
   }
   goBack()
   $("#navbar").show();
}

// Update progress bar every 1 second
function updateProgressBar() {
   if (video.playState) {
      var progressBar = document.getElementById('progress-bar');
      var percentage = Math.round((video.playPosition / video.playTime) * 100);
      progressBar.value = percentage;
   }
}

// Notify the server that we started playing an item
function notifyPlaying() {
   loadJSON("/Sessions/Playing", "POST",
   function () {
      console.log("Notification sent to server successfully")
   },
   function (error) {
      console.log(error)
   }, JSON.stringify(playback.currentState))
}

// Keep the server updated with changes
function notifyProgress(reason) {
   playback.currentState.EventName = reason
   if (video.speed === 0) {
      playback.currentState.IsPaused = true
   }
   // Convert to ticks
   var current_ticks = video.playPosition * 1e4
   // Set
   playback.currentState.PositionTicks = current_ticks
   loadJSON("/Sessions/Playing/Progress", "POST",
   function () {
      console.log("Notification sent to server successfully")
   },
   function (error) {
      console.log(error)
   }, JSON.stringify(playback.currentState))
}

// Notify the server that we stopped playing the item
function notifyStopPlaying() {
   loadJSON("/Sessions/Playing/Stopped", "POST",
   function () {
      console.log("Notification sent to server successfully")
   },
   function (error) {
      showToast(error)
   }, JSON.stringify(playback.currentState))
}
