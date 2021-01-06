// Video
var video = document.getElementById("video");
var progressInterval;
var playingInterval;
function startVideo() {
   getPlaybackInfo()
   video.width = selected_item.Width
   video.height = selected_item.Height
   parent.location.hash = "#player";
   $("#navbar").hide();
   video.data = userinfo.host + "/Items/" + selected_item.Id + "/Download?api_key=" + userinfo.token;
   video.play();
   video.onPlayStateChange = processPlayState;
   progressInterval = setInterval(updateProgressBar, 1000);
   //playingInterval = setInterval(updatePlaying, 10000)
}

function getPlaybackInfo() {
   loadJSON("/Items/" + selected_item.Id + "/PlaybackInfo?UserId=" + userinfo.id + "&MediaSourceId=" + selected_item.MediaSources[0].Id, "POST",
   function(data) {
      selected_item.playSession = data.PlaySessionId
   },
   function(error) {
      showToast(error.response)
   })
}

function updatePlaying() {

}

function processPlayState() {
   if (video.playState === 5) {
      stopPlayer()
   }
}

function togglePlayPause() {
   var btn = document.getElementById('play-pause-button');
   // 1: Is playing, 2: Is paused, 3: Connecting, 4: Buffering, 5: Finished, 6: Error
   if (video.playState === 1) {
      btn.innerText = '►';
      video.pause();
   }
   else if (video.playState === 2) {
      btn.innerText = '❙❙';
      video.play();
   }
}

function stopPlayer() {
   video.onPlayStateChange = undefined
   video.pause();
   video.currentTime = 0;
   video.data = ''
   clearInterval(progressInterval)
   goBack()
   $("#navbar").show();
}

function updateProgressBar() {
   if (video.playState)
   var progressBar = document.getElementById('progress-bar');
   var percentage = Math.round((video.playPosition / video.playTime) * 100);
   progressBar.value = percentage;
}
