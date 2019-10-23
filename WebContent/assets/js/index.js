// JSON Loading
function loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

//Show or hide div elements
function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

function login(){
  ip = document.getElementById("ip").value;

  port = document.getElementById("port").value;

  whole_url = "http://" + ip + ":" + port
  show ('login', false);
  show ('users', true);
  loadJSON(whole_url + "/emby/Users/Public",
    function(data) {
      var i = 0;
      while (i < data.length) {
          console.log(i + " " + data[i].Name);
          document.getElementById("users").innerHTML = "<a href='javascript:user(" + '"'  + data[i].Name + '"' + ");'>" + "<img src=assets/images/menus/user_icon.png width='152' height='152' id=" + data[i].Name + "</a>";
          i++;
      }
    },
    function(xhr) {
        console.error(xhr);
        show('login', true);
        show('users', false);
        alert("There was an error trying to connect to the server");
    }
);
}

function user(user){
  console.log(user);
  //Get User's ID
  loadJSON(whole_url + "/emby/Users/Public",
      function(data) {
        var i = 0;
        while (i < data.length) {
            console.log(i + " " + data[i].Name);
            if (data[i].Name === user){
              id = data[i].Id;
            }
            i++;
        }
          console.log("Your user ID is: " + id);
          show('users', false);
          show('passwd', true);
      },
      function(xhr) {
          console.error(xhr);
      }
  );

}
function passwd(){
  console.log("Test");
}
function content(clicked_id) {
    content_type = clicked_id;

    show('content', false);
    show('items', true);
    show('top', true);

    console.log("Button clicked: " + clicked_id);
    if (clicked_id === "movies_img") {
        getmovies();
    } else if (clicked_id === "tv_img") {
        gettv();
    } else if (clicked_id === "music_img") {
        getmusic();
    } else {
        alert("I don't know which button you clicked");
    }
}

function getmovies() {
    loadJSON(whole_url + "/emby/Users/" + id + "/Items?api_key=" + api + "&Recursive=true&IncludeItemTypes=Movie",
        function(data) {
            movies = data;
            var i = 0;
            while (i < data.Items.length) {
                console.log(i + " " + data.Items[i].Name);
                document.getElementById("items").innerHTML += "<a href='javascript:videoplayer(movies.Items[" + i + "].Id)''>" + "<img src=" + whole_url + "/emby/Items/" + data.Items[i].Id + "/Images/Primary width=180 height=270>";
                i++;
            }
        },
        function(xhr) {
            console.error(xhr);
        }
    );
}

function gettv() {
    loadJSON(whole_url + "/emby/Users/" + id + "/Items?api_key=" + api + "&Recursive=true&CollectionType=tvshows&includeItemTypes=Series&SortBy=SortName", //http://192.168.1.5:8096/emby/Users/c13f8113bf02412b97c193e1ec73d960/Items?api_key=24f18d49ae0149749a595363e4b48e10
        function(data) {
            tv = data;
            var i = 0;
            while (i < data.Items.length) {
                console.log(i + " " + data.Items[i].Name);
                document.getElementById("items").innerHTML += "<a href='javascript:videoplayer(tv.Items[" + i + "].Id)''>" + "<img src=" + whole_url + "/emby/Items/" + data.Items[i].Id + "/Images/Primary width=180 height=270>";
                i++;
            }
        },
        function(xhr) {
            console.error(xhr);
        }
    );
}

function getmusic() {
    loadJSON(whole_url + "/emby/Users/" + id + "/Items?api_key=" + api + "&Recursive=true&CollectionType=music&includeItemTypes=Audio&SortBy=SortName",
        function(data) {
            music = data;
            var i = 0;
            while (i < data.Items.length) {
                console.log(i + " " + data.Items[i].Name);
                document.getElementById("items").innerHTML += "<a href='javascript:videoplayer(music.Items[" + i + "].Id)''>" + "<img src=" + whole_url + "/emby/Items/" + data.Items[i].Id + "/Images/Primary width=270 height=270>" + data.Items[i].Name;
                i++;
            }
        },
        function(xhr) {
            console.error(xhr);
        }
    );
}

function videoplayer(id_item) {
    console.log(id_item);
    show('items', false);
    show('playerLayout', true);

    //*****************************************************************************
    //	 LCD TV LABORATORY, LG ELECTRONICS INC., SEOUL, KOREA
    //	 Copyright(c) 2010 by LG Electronics Inc.
    //
    //	 All rights reserved. No part of this work may be reproduced, stored in a
    //	 retrieval system, or transmitted by any means without prior written
    //	 permission of LG Electronics Inc.
    //
    //	 Following functions are for NetCast Test Suite.
    //
    //*****************************************************************************
    var allMenuObject;
    var cntIndex = 1;
    var allExitObject;
    var id=["stop","play","rewind","forward","view","option"];
    var videoArray = [whole_url + "/emby/Videos/" + id_item + '/stream.mp4'];
    var supportedMimeTypes = [".mp4", ".mpeg", ".wmv", ".asf"];
    var defaultClass = ["stopButton", "playButton", "rewindButton", "forwardButton", "optionButton"];
    var exitBtnClass = ["backKey", "exitKey"];
    var video;
    var progressBarWidth;
    var TIME_FOR_SEEK = 10;
    var playTimerId;
    var hideTimerId;
    var rowID = 1;
    var tempcntIndex = -1;
    var mouseDown = false;
    var videoPlayInfo;
    var dragged = false;
    var vidIndex = 0;

    /*
    Function ready()
    @param -event
    @Description - This has the implementation of ready, which loads the video player
    Returns  -void
    */
    $('document').ready(function() {
        allMenuObject = new Array();
        allExitObject = new Array();
        video = getVideo();
        playMedia();
        video.onPlayStateChange = playStateChange;
        video.onBuffering = buffering;
        progressBarWidth = $('#progressBg').width();
        //on mousemove, show player controls
        $('.playerLayout').on("mousemove ", function(event) {
            showPlayer();
            triggerHide();
        });
        //to hideplayer
        $('#videoHolder').on("click", function(event) {
            hidePlayer();
        });
        //on mouseenter change the button color using classes of each control button respectively
        $("#buttonLayout ul li").each(function(i) {
            $(this).on("mouseenter", function(event) {
                resetFocus();
                $(this).toggleClass(defaultClass[i] + "Hover");
                rowID = 1;
                cntIndex = i;
            });
        });
        //on click of the control buttons of the video, respective function will be called
        var elem = $("#buttonLayout ul li");
        $("#buttonLayout ul li").click(function() {
            selectedButton();
        });

        for (i = 0; i < elem.length; i++) {
            allMenuObject.push(elem[i]);
        }

        $(allMenuObject[1]).toggleClass(defaultClass[1] + "Hover");
        //on click of the button, respective function will be called to go back or to exit
        var exitElem = $(".keyHelp div");
        $(".keyHelp div").click(function() {
            selectedButton();
        });
        //on mouseenter change the button color using classes of each button respectively
        $(".keyHelp div").each(function(i) {
            $(this).on("mouseenter", function(event) {
                resetFocus();
                $(this).toggleClass(exitBtnClass[i] + "Hover");
                rowID = 3;
                cntIndex = i;
            });
        });
        for (i = 0; i < exitElem.length; i++) {
            allExitObject.push(exitElem[i]);
        }
        /* on mouseenter of progressBall class, change to progressBallHover class */
        $("#progressBall").on("mouseenter", function(event) {
            if (video.playState == 1) {
                resetFocus();
                $(this).toggleClass("progressBallHover");
                rowID = 2;
                cntIndex = i;
                /* to drag on progressBar, video plays from where progressBall will be pointing*/
                $(".progressBallHover").draggable({
                    axis: 'x',
                    disabled: false,
                    containment: '#ballCoverage',
                    start: function(event, ui) {
                        dragged = true;
                    },
                    stop: function(event, ui) {
                        var xmove = ui.position.left;
                        var seekedTime = (xmove / progressBarWidth) * videoPlayInfo.duration;
                        video.seek(seekedTime);
                    }
                });
            }
        });
        $("#progressBall").on("mouseleave", function(event) {
            $(".progressBallHover").draggable("disable");
        });
        /* on clicking on progressBar, progressBall moves & video plays from where progressBall will be pointing*/
        $('.progressBarClick').click(function(e) {
            if (video.playState == 1) {
                var xmove = e.pageX - $(this).offset().left;
                var seekedTime = (xmove / progressBarWidth) * videoPlayInfo.duration;
                video.seek(seekedTime);

            }

        });

        /*
        Function keydown()
        @param -event
        @Description - This has the implementation of keydown like lfet right up and donw
        Returns  -void
        */

        $(document).keydown(function(event) {
            var key = event.keycode || event.which;
            switch (key) {
                case VK_BACK:
                    if (window.NetCastBack) {
                        window.NetCastBack();
                    }
                    break;
                case VK_RIGHT:
                    setFocus(1)
                    break;
                case VK_LEFT:
                    setFocus(-1)
                    break;
                case VK_UP:
                    if (rowID < 4) {
                        rowID++;
                    }
                    if (video.playState != 1 && rowID == 2) {
                        rowID = 3;
                    }
                    if (rowID == 3) {
                        tempcntIndex = cntIndex;
                        cntIndex > 1 ? cntIndex = 1 : "";
                    }
                    setFocus(0);
                    break;
                case VK_DOWN:
                    if (rowID > 1) {
                        rowID--;
                        tempcntIndex != -1 ? cntIndex = tempcntIndex : "";
                        tempcntIndex != -1;
                    }
                    if (video.playState != 1 && rowID == 2) {
                        rowID = 1;
                    }
                    setFocus(0);
                    break
                case VK_ENTER:
                    $(".playerBottom").is(":visible") ? selectedButton() : "";
                    break;
            }
            showPlayer();
            triggerHide();
        });
    });

    /*
    Function triggerHide()
    @param -none
    @Description - This triggers the hide function in 5 seconds
    Returns  -void
    */
    function triggerHide() {
        if (video.playState == 1 || video.playState == 4 || video.playState == 2) {
            clearTimeout(hideTimerId);
            hideTimerId = setTimeout("hidePlayer()", 5000);
        }
    }

    /*
    Function hidePlayer()
    @param -none
    @Description - function to hide the player controls
    Returns  -void
    */
    function hidePlayer() {
        $(".playerBottom").hide(100);
    }

    /*
    Function showPlayer()
    @param -none
    @Description - function to show the player controls
    Returns  -void
    */
    function showPlayer() {
        $(".playerBottom").show()
    }

    /*
    Function setFocus()
    @param -button index
    @Description - This changes the color of the button from normal to focus (mouse over or remote keynavigation)
    Returns  -void
    */
    function setFocus(idx) {
        if (rowID == 1) {
            if (allMenuObject[cntIndex + idx] != undefined) {
                resetFocus();
                cntIndex = cntIndex + idx;
                $(allMenuObject[cntIndex]).addClass(defaultClass[cntIndex] + "Hover");
            }

        } else if (rowID == 2) {
            if (idx != 0) {
                idx == 1 ? forwardMedia() : rewindMedia();
            } else {
                resetFocus();
                $("#progressBall").addClass("progressBallHover");
            }
        } else if (rowID == 3) {
            if (allExitObject[cntIndex + idx] != undefined) {
                resetFocus();
                cntIndex = cntIndex + idx;
                $(allExitObject[cntIndex]).addClass(exitBtnClass[cntIndex] + "Hover");
            }
        }
    }
    /*
    Function resetFocus()
    @param - none
    @Description - This changes the color of the button from focus to noramal (mouse over or remote keynavigation)
    Returns  -void
    */
    function resetFocus() {
        $("#buttonLayout li").each(function(i) {
            $(allMenuObject[i]).removeClass(defaultClass[i] + "Hover");
        });

        $(".keyHelp div").each(function(i) {
            $(allExitObject[i]).removeClass(exitBtnClass[i] + "Hover");
        });
        $("#progressBall").removeClass("progressBallHover");
    }

    /*
    Function playStateChange()
    @param - none
    @Description - Depending upon the Video Playstate, the functions are called.
    Returns  -void
    */
    function playStateChange() {
        if (video.playState == 0) {
            resetProgress();
        } else if (video.playState == 5) {
            resetProgress();
            vidIndex < videoArray.length - 1 ? vidIndex++ : vidIndex = 0;
            playMedia();
        } else if (video.playState == 1) {
            $('#progressBall').attr('class', 'progressBall');
            triggerHide();
            getVideoSourceInfo();
            getVideoPlayInfo();
        } else if (video.playState == 6) {
            //notifyError;
        }
    }
    /*
    Function buffering()
    @param - none
    @Description - It implements the buffering of the video. As video buffers, the progress bar will
    gradually increases with light pink color, showing the buffering progress
    Returns  -void
    */
    function buffering() {
        videoPlayInfo = video.mediaPlayInfo();
        if (videoPlayInfo) {
            if (videoPlayInfo.bufRemain != -1) {
                var bufferPos = Math.ceil((videoPlayInfo.bufRemain / videoPlayInfo.duration) * progressBarWidth);
                var pos = videoPlayInfo.duration - videoPlayInfo.bufRemain;
                if (pos != 0) {
                    pos = (pos / videoPlayInfo.duration) * progressBarWidth;
                    bufferPos += pos;
                    setBufferPosition(bufferPos);
                }
            }
        }
        if (video.playState == 4) {
            setTimeout("buffering()", 100);
        }
    }
    /*
    Function setBufferPosition()
    @param - position
    @Description - to show the buffering progress
    Returns  -void
    */
    function setBufferPosition(position) {
        $("#progressBuffer").addClass("progress progressBuffer");
        $("#progressBuffer").css("width", position + 'px');
    }

    /*
    Function selectedButton()
    @param -obj-the current selected HTML object
    @Description - This function implements the on Enter function of remote or mouse click.
    Returns  -void
    */

    function selectedButton() {
        if (rowID == 1) {
            switch (cntIndex) {
                case 0: //stops the playing video
                    stopMedia();
                    break;
                case 1: //plays the video
                    playMedia();
                    break;
                case 2: //rewinds the video
                    rewindMedia();
                    break;
                case 3: //forwards the video
                    forwardMedia();
                    break;
                case 4: //opens window for settings
                    optionMedia();
                    break;

            }
        } else if (rowID == 3) {
            switch (cntIndex) {
                case 0: //back
                case 1: //exit same for the moment
                    if (window.NetCastBack) {
                        window.NetCastBack();
                    }
                    break;
            }
        }
    }
    /*
    Function getVideo()
    @param- none
    @Description- gets the object of video
    Returns- video object
    */
    function getVideo() {
        return document.getElementById('video');
    }
    /*
    Function resetProgress()
    @param- none
    @Description- resets all the functionalities, when video is stopped or video is finished
    Returns- none
    */
    function resetProgress() {

        clearTimeout(playTimerId);
        clearTimeout(hideTimerId);
        showPlayer();
        $("#progressBarStatus").css("width", '0px');
        $('#progressBall').attr('class', 'progressBallInitial');
        if (dragged) {
            $('.progressBallInitial').draggable("disable");
        }
        dragged = false;
        $('#progressBall').css("left", '0px');
        $("#progressBuffer").css("width", '0px');
        $("#play > img").remove();
        $('#play').append('<img src="images/player_btn_icon/movie_btn_icon_play_n.png" class="center" />');
        $("#remainingTime").text("");
        $("#totalTime").text("");
        $(".runningMovieName").text("");
        $(".runningMovieType").text("");
        resetFocus();
        cntIndex = 1;
        rowID = 1;
        mouseDown = false;
        $(allMenuObject[1]).toggleClass(defaultClass[1] + "Hover");
    }
    /*
    Function getTimeFromMS()
    @param- none
    @Description- to convert the millisecond in hr:min:sec formatted way
    Returns- none
    */
    function getTimeFromMS(msec) {
        var time = Math.round(msec / 1000);
        var hours = Math.floor(time / 3600);
        var mins = Math.floor((time % 3600) / 60);
        var secs = Math.floor((time % 3600) % 60);

        if (hours < 10)
            hours = "0" + hours;
        if (mins < 10)
            mins = "0" + mins;
        if (secs < 10)
            secs = "0" + secs;

        return hours + ":" + mins + ":" + secs;

    }
    /*
    Function setPosition()
    @param - position
    @Description - to show the running video progress, it keeps track of
    progress status bar & progress ball as video runs.
    Returns  -void
    */
    function setPosition(position) {
        $("#progressBarStatus").addClass("progress progressBarStatus");
        $("#progressBarStatus").css("width", position + 'px');
        if (rowID == 2) {
            $('#progressBall').css("left", position - 14 + 'px')
        } else {
            $('#progressBall').css("left", position + 'px')
        }
    }
    /*
    Function getVideoPlayInfo()
    @param- none
    @Description- to get the playing video information
    Returns- none
    */

    function getVideoPlayInfo() {
        videoPlayInfo = video.mediaPlayInfo();
        if (videoPlayInfo) {
            if ((video.playState != 5) && (video.playState != 0) && (video.playState != 2)) {
                $("#remainingTime").text(getTimeFromMS(videoPlayInfo.currentPosition));
                $("#totalTime").text(" / " + getTimeFromMS(videoPlayInfo.duration));
                var pos = Math.ceil((videoPlayInfo.currentPosition / videoPlayInfo.duration) * progressBarWidth);
                setPosition(pos);
                playTimerId = setTimeout("getVideoPlayInfo()", 100);
            }
        }
    }
    /*
    Function getVideoSourceInfo()
    @param- none
    @Description- to get the playing video's source information
    Returns- none
    */
    function getVideoSourceInfo() {
        var videoSourceInfo = video.getSrcInfo();
        videoSourceInfo.title != null ? $(".runningMovieName").text(videoSourceInfo.title) : "";
    }
    /*
    Function loadDataSrc()
    @param- autoplay, to strt the video without clicking play button
    @Description- sets the source to video object
    Returns- none
    */
    function loadDataSrc(auto) {
        var vidPath = videoArray[vidIndex];
        if (checkFileExtensions(vidPath)) {
            video.data = "media/" + vidPath;
            video.play(1);
        } else {
            console.log("video not supported");
        }
    }
    /*
    Function stopMedia()
    @param- none
    @Description- stops the running video
    Returns- none
    */
    function stopMedia() {
        if (video.playState != 0)
            video.stop();
    }
    /*
    Function playMedia()
    @param- none
    @Description- plays & pauses the video
    Returns- none
    */
    function playMedia() {
        if (video.playState == 0 || video.playState == 5) {
            loadDataSrc(true);
            $("#play > img").remove();
            $('#play').append('<img src="images/player_btn_icon/movie_btn_icon_pause_n.png" class="center" />');

        }
        if (video.playState == 2) {
            //play
            video.play(1);
            $("#play > img").remove();
            $('#play').append('<img src="images/player_btn_icon/movie_btn_icon_pause_n.png" class="center" />');
        } else if (video.playState == 1) {
            //pause
            video.play(0);
            $("#play > img").remove();
            $('#play').append('<img src="images/player_btn_icon/movie_btn_icon_play_n.png" class="center" />');
        }
    }

    /*
    Function forwardMedia()
    @param- none
    @Description- forwards the running video by 10sec.
    Returns- none
    */
    function forwardMedia() {
        if (video.playState != 4 && video.playState == 1) {
            if (video.isSeekable) {
                if ((video.playPosition + (TIME_FOR_SEEK * 1000)) < videoPlayInfo.duration * 1000) {
                    video.seek(video.playPosition + (TIME_FOR_SEEK * 1000));
                } else {
                    video.seek(videoPlayInfo.duration);
                }
            }
        }
    }
    /*
    Function rewindMedia()
    @param- none
    @Description- rewinds the running video by 10sec.
    Returns- none
    */
    function rewindMedia() {
        if (video.playState != 4 && video.playState == 1) {
            if (video.isSeekable) {
                if ((video.playPosition - (TIME_FOR_SEEK * 1000)) > 0) {
                    video.seek(video.playPosition - (TIME_FOR_SEEK * 1000));
                } else {
                    video.seek(0);
                }
            }
        }
    }
    /*
    Function optionMedia()
    @param- none
    @Description- opens window for settings
    Returns- none
    */
    function optionMedia() {
        if (window.NetCastLaunchQMENU) {
            window.NetCastLaunchQMENU();
        }
    }
    /*
    Function checkFileExtensions()
    @param- url the videotype
    @Description- checks for the supported formats
    Returns- none
    */
    function checkFileExtensions(url) {
        for (var i = 0; i < supportedMimeTypes.length; i++) {
            if (url.lastIndexOf(supportedMimeTypes[i]) > 0) {
                return true;
            }
        }
        return false;
    };
}
