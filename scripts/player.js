// Video

function startVideo(content_id) {
   parent.location.hash = "#player";
   $(".topnav").hide();
   var video = document.getElementById("video");
   video.addEventListener('timeupdate', updateProgressBar, false);
   video.data = host + "/Videos/" + content_id + "/master.m3u8"
   video.play(1);
}

function togglePlayPause() {
   var btn = document.getElementById('play-pause-button');
   if (video.paused || video.ended) {
      btn.title = 'pause';
      btn.innerHTML = 'pause';
      btn.className = 'pause';
      video.play(1);
   }
   else {
      btn.title = 'play';
      btn.innerHTML = 'play';
      btn.className = 'play';
      video.pause();
   }
}

function stopPlayer() {
   video.data = ''
   video.pause();
   video.currentTime = 0;
   $("#player").hide();
   $("#items").show();
   parent.location.hash = "#items";
}

function updateProgressBar() {
   var progressBar = document.getElementById('progress-bar');
   var percentage = Math.floor((100 / video.duration) * video.currentTime);
   progressBar.value = percentage;
   progressBar.innerHTML = percentage + '% played';
}
