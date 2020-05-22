// Video

function playvid(content_id) {

   var hash = window.location.hash.substring(1);
   console.log(hash);
   // Probably a better way to do this
   if (hash == 'items') {
      $("#items").hide();
   }
   if (hash == 'episodes') {
      $("#episodes").hide();
   }

   parent.location.hash = "#player";
   $(".topnav").hide();
   $("#player").show();
   var video = document.getElementById("video");
   video.addEventListener('timeupdate', updateProgressBar, false);
   video.src = whole_url + "/emby/Videos/" + content_id + "/stream.mp4"
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

// Music

function playmusic(content_id) {
   var hash = window.location.hash.substring(1);
   console.log(hash);
   $("#items").hide();
   parent.location.hash = "#player";
   $(".topnav").hide();
   $("#music").show();
   document.getElementById('music').src = whole_url + "/emby/Audio/" + content_id + "/stream.mp3";
}