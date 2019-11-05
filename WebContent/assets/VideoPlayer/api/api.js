function lge() {
    var _this = this;
    var autoPlaying;
    var playing;
    var fullScreenMode;
    var leftTopPos;
    var containerDiv;
    var containerWidth = null;
    var containerHeight = null;
    var ratioWidth = null;
    var ratioHeight = null;
    var videoPath = "";
    var video;
    var currentIndex;
    var TIME_FOR_SEEK = 10;
    var minPlayerHeight = 180;
    var minPlayerWidth = 320;
    var interval = null;
    var videoPlayInfo;
    var supportedMimeTypes = [".mp4", ".mpeg", ".wmv", ".asf"];
    var playTimerId;
    var hideTimerId;
    var key_naviObj = null;
    var objectFocussed = null;
    var rowID = 1;
    var dragged = false;
    var bufferWidthRatio = 0;
	var bControlsAdded=false;
    // Constructor
    this._construct = function () {
        fullScreenMode = false;
        currentIndex = 0;
    };

    // Public Functions
    /*
     * Function createVideoPlayer() @param -container - div container,
     * where video will be player will be displayed. @Description - This function create VideoPlayer for the
     * given container div Returns -void
     */
    this.createVideoPlayer = function (container, controls, videoPath) {
        $(container).append('<object type="application/x-netcast-av" width="100%" height="100%" id="video"></object>');
        video = getVideo();
        video.onPlayStateChange = playStateChange;
        video.onBuffering = buffering;
        containerDiv = container;
        leftTopPos = [$(containerDiv).offset().left, $(containerDiv).offset().top];

        containerWidth = $(containerDiv).width();
        containerHeight = $(containerDiv).height();
        checkPlayerDimensions();
		bControlsAdded = controls;
		if(controls){
        	addControls(container);
        	key_naviObj = keyNavigation();
		}
        getSupportedVideoFiles(videoPath);

        mouseControl();
    };

    /*
     * Function fastForward() @param - @Description - function forwards the video playback
     * to 10 sec. Returns -void
     */
    this.fastForward = function () {
        if (video.playState != 4) {
            if (video.isSeekable) {
                if ((video.playPosition + (TIME_FOR_SEEK * 1000)) < videoPlayInfo.duration * 1000) {
                    video.seek(video.playPosition + (TIME_FOR_SEEK * 1000));
                } else {
                    video.seek(videoPlayInfo.duration);
                }
                video.playState == 2 ? _this.play() : "";
            }
        }
        return;
    };

    /*
     * Function rewind() @param - @Description - function rewinds the video playback
     * to 10 sec. Returns -void
     */
    this.rewind = function () {
        if (video.playState != 4) {
            if (video.isSeekable) {
                if ((video.playPosition - (TIME_FOR_SEEK * 1000)) > 0) {
                    video.seek(video.playPosition - (TIME_FOR_SEEK * 1000));
                } else {
                    video.seek(0);
                }
                video.playState == 2 ? _this.play() : "";
            }
        }
        return;
    };

    /*
     * Function play() @param - @Description - This function plays & pauses
	 the video. Returns -void
     */
    this.play = function () {

        if (video.playState == 0 || video.playState == 5) {
            video.data = videoPath;
            video.play(1);
            $("#playBtn > img").remove();
            $('#playBtn').append('<img src="assets/VideoPlayer/ui/images/player_btn_icon/movie_btn_icon_pause_n.png" alt="pauseImg" class="playBtn" align="center" />');
        }
        if (video.playState == 2) {
            // play
            video.play(1);

            $("#playBtn > img").remove();
            $('#playBtn').append('<img src="assets/VideoPlayer/ui/images/player_btn_icon/movie_btn_icon_pause_n.png" alt="pauseImg" class="playBtn" align="center" />');

        } else if (video.playState == 1) {
            // pause
            video.play(0);
            $("#playBtn > img").remove();
            $('#playBtn').append('<img src="assets/VideoPlayer/ui/images/player_btn_icon/movie_btn_icon_play_n.png" alt="playImg" class="playBtn" align="center" />');
        }

    };

    /*
     * Function stop() @param - @Description - This function stops currently
     * playing video. Returns -void
     */
    this.stop = function () {
        if (video.playState != 0) video.stop();

    };
    /*
     * Function switchToFullScreenMode() @param - @Description - This function
     * toggles the fullscreen display. Returns -void
     */
    this.switchToFullScreenMode = function () {
        if (!fullScreenMode) {
            $(containerDiv).css({
                "position": "absolute",
                width: 1280,
                height: 720,
            });
            fullScreenMode = true;
            showControl();
            setControlButton();
        } else if (fullScreenMode) {
            $(containerDiv).css({
                "position": "absolute",
                left: leftTopPos[0],
                top: leftTopPos[1],
                width: containerWidth,
                height: containerHeight
            });
            fullScreenMode = false;
            showControl();
            setControlButton();
        }
    };

    /*
     * Function optionMedia() @param- none @Description- opens window for
     * settings Returns- none
     */
    this.optionMedia = function () {
        if (window.NetCastLaunchQMENU) {
            window.NetCastLaunchQMENU();
        }
    };

    /*
     * Function playStateChange() @param - none @Description - Depending upon
     * the Video Playstate, the functions are called. Returns -void
     */
    playStateChange = function () {
        if (video.playState == 5 || video.playState == 0 ) {
            resetProgress();
        } else if (video.playState == 1) {
            if ($('#progressBall').hasClass("progressBallInitial")) {
                $('#progressBall').attr('class', 'progressBall');
                $(".progressBall").css({
                    "width": ratioWidth * 71,
                        "height": ratioHeight * 44,
                });
            }
            triggerHide();
            getVideoSourceInfo();
            getVideoPlayInfo();
        } else if (video.playState == 6) {
            //notifyError;
        }
    }
    /*
	 Function getVideoPlayInfo()
	 @parag-none
	 @Description- gets running video's time info
	 @returns - none
	 */
    getVideoPlayInfo = function () {
        var videoPlayInfo = video.mediaPlayInfo();

        if (videoPlayInfo) {
            if ((video.playState != 5) && (video.playState != 0) && (video.playState != 2)) {
                $("#remainingTime").text(getTimeFromMS(videoPlayInfo.currentPosition));
                $("#totalTime").text(" / " + getTimeFromMS(videoPlayInfo.duration));
                var pos = Math.ceil((videoPlayInfo.currentPosition / videoPlayInfo.duration) * $(".progressBg").width());
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
    getVideoSourceInfo = function () {
        var videoSourceInfo = video.getSrcInfo();
        videoSourceInfo.title != null ? $(".runningMovieName").text(videoSourceInfo.title) : "";
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

        if (hours < 10) hours = "0" + hours;
        if (mins < 10) mins = "0" + mins;
        if (secs < 10) secs = "0" + secs;
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
            $('#progressBall').css("left", position - 14 * ratioWidth + 'px');
        } else {
            $('#progressBall').css("left", position + 'px');
        }
    }
    /*
     * Function buffering() @param - none @Description - It implements the
     * buffering of the video. As video buffers, the progress bar will gradually
     * increases with light pink color, showing the buffering progress Returns
     * -void
     */
    buffering = function () {
        videoPlayInfo = video.mediaPlayInfo();
        if (videoPlayInfo) {
            if (videoPlayInfo.bufRemain != -1) {
                var bufferPos = Math.ceil((videoPlayInfo.bufRemain / videoPlayInfo.duration) * $(".progressBg").width());
                var pos = videoPlayInfo.duration - videoPlayInfo.bufRemain;
                if (pos != 0) {
                    pos = (pos / videoPlayInfo.duration) * $(".progressBg").width();
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
        bufferWidthRatio = position / $(".progressBg").width();
    }

    /*
     * Function setControlButton() @param - @Description - This function
     * positions control buttons. Returns -void
     */
    setControlButton = function () {
        var controlBtntop = $(containerDiv).height() / 2 - 27;
        var controlBtnleft = $(containerDiv).width();
        var tmpTop = $("#lgVid_control").height();

        $(".playerBottom").css({
            "position": "absolute",
            width: $(containerDiv).width() * .99,
            height: $(containerDiv).height() * .24,
            top: $(containerDiv).height() - $(".playerBottom").height(),
            "border": "none",
            "margin": "auto",
			"display": "block",
        });
        $(".playerBottom").css({
            top: $(containerDiv).height() - $(".playerBottom").height(),
            left: ($(containerDiv).width() - $(".playerBottom").width()) / 2
        });
        $(".playerButtonLayout").css({
            width: $(containerDiv).width() * .975,
			"border": "none",
			"margin": "auto",
			"text-align": "center",
			"display": "block"
        });

        $(".progressBarLayout").css({
            "position": "absolute",
            left: controlBtnleft * .015,
			"border": "none",
			"margin": "auto",
			"padding": "0px",
			"text-align": "center",
			"display": "block"
        });


        $(".progressBar").css({
            "position": "absolute",
            left: controlBtnleft * .015,
            width: $(".progressBarLayout").width(),
            height: $(".progressBarLayout").height() * .63,
			"border": "none",
			"margin": "auto",
			"padding": "0px",
			"text-align": "center",
			"display": "block"
        });
        $(".progress").css({
            "position": "absolute",
            height: $(".progressBar").height() * .10,
            /*top: ($(".progress").parent().height()) * .85,*/
            top: ($(".progress").parent().height()) * .90,
			"border": "none",
			"margin": "auto",
			"padding": "0px",
			"text-align": "center",
			"display": "block"
        });
        $(".progressBarClick").css({
            width: $(".progressBg").width(),
            height: "35%",
            top: ($(".progress").parent().height()) * .65,
        });

        $(".runningMovieInfo").css({
            "position": "absolute",
            left: controlBtnleft * .015,
            width: $(".progressBarLayout").width(),
            height: $(".progressBarLayout").height() * .37,
            top: $(".progressBar").height(),
			"border": "none",
			"margin": "auto",
			"padding": "0px",
			"text-align": "center",
			"display": "block"
        });
        $(".runningMovieName").css({
            "font-size": ($(".runningMovieName").height()) * .95 + "px"
        });
        $(".runningMovieType").css({
            "font-size": ($(".runningMovieType").height()) * .63 + "px",
                "margin-right": "3%",
        });
        $(".runningTime").css({
            "width": "20%",
			"height": $(".progressBar").height() / 2,
			"margin-top": $(".progressBar").height() / 2,
			"margin-left": $(".progressBar").height() - 10,
			"margin-right": "3%",
			"float": "right",
			"text-align": "left",
			"display": "block"
        });
        $(".runningTime").css({
            "font-size": ($(".runningTime").height()) * .70 + "px"
        });
        $("#lgVid_control").css({
            "position": "absolute",
            top: ($("#lgVid_control").parent().height()) * .600,
            left: controlBtnleft * .0148,
			"border": "none",
			"margin": "0px",
			"padding": "0px",
			"text-align": "center",
			"display": "block"
        });
        ratioWidth = ($(containerDiv).width() / 1280);
        ratioHeight = ($(containerDiv).height() / 720);


        if (rowID == 2) {
            $('#progressBall').css("width", ratioWidth * 104);
            $('#progressBall').css("height", ratioHeight * 60);
        } else {
            $('#progressBall').css("width", ratioWidth * 71);
            $('#progressBall').css("height", ratioHeight * 60);
        }

        if (bufferWidthRatio != 0) {
            $("#progressBuffer").css("width", bufferWidthRatio * $(".progressBg").width());
        }
		if(video.playState!=5){
			var pos = Math.ceil((video.mediaPlayInfo().currentPosition / video.mediaPlayInfo().duration) * $(".progressBg").width());
			setPosition(pos);
		}
        if ((containerWidth == 1280) && (containerHeight == 720)) {
            $("#switchToFullScreenMode").css("display", "none");
            $("#option").css("display", "block");
            $("#lgVid_control").children().each(function (i) {
                $(this).css({
                    "width": "20%"
                });
            });
        }
        clearTimeout(playTimerId);
        getVideoPlayInfo();
    };

    /*
     * Function addControls() @param -container- div container @Description -
     * it will add all the control buttons and their handlers method. Returns
     * -void
     */

    addControls = function (container) {
        $(container)
            .append(
            '<div class="playerBottom">' + '<div class="playerButtonLayout">' + '<div class="progressBarLayout">' + '<div class="progressBar">' + '<div id="progressBg" class="progress progressBg"></div>' + '<div id="progressBuffer" class="progress progressBuffer" ></div>' + '<div id="progressBarStatus" class="progress progressBarStatus"></div>' + '<div id="progressBarClick" class="progress progressBarClick"></div>' + '<div class="runningTime"> <span id="remainingTime"></span> <span id="totalTime" ></span> </div>' + '</div>'
            + '</div>' + '<div id="lgVid_control">' + '<div id="stop" class="ctrlButtonNormalLeft"><div class="bottomControlBtn" align="center" ><img src="assets/VideoPlayer/ui/images/player_btn_icon/movie_btn_icon_stop_n.png" alt="stopImg" class="stopBtn"/></div></div>' + '<div id="play" class="ctrlButtonNormal"><div id="playBtn" class="bottomControlBtn" align="center" ><img src="assets/VideoPlayer/ui/images/player_btn_icon/movie_btn_icon_play_n.png" alt="playImg"  class="playBtn" align="center" /></div></div>' + '<div id="rewind" class="ctrlButtonNormal"><div class="bottomControlBtn" align="center"><img src="assets/VideoPlayer/ui/images/player_btn_icon/movie_btn_icon_rewind_n.png" alt="rewindImg" class="rewindBtn"/></div></div>' + '<div id="forward" class="ctrlButtonNormal"><div class="bottomControlBtn" align="center"><img src="assets/VideoPlayer/ui/images/player_btn_icon/movie_btn_icon_forward_n.png" alt="forwardImg" class="forwardBtn"/></div></div>' + '<div id="switchToFullScreenMode" class="ctrlButtonNormal"><div class="bottomControlBtn" align="center"><img src="assets/VideoPlayer/ui/images/player_btn_icon/movie_btn_icon_chapter_n.png" alt="screenImg" class="switchToFullScreenModeBtn"/></div></div>' + '<div id="option" class="ctrlButtonNormal"><div class="bottomControlBtn" align="center"><img src="assets/VideoPlayer/ui/images/player_btn_icon/movie_btn_icon_option_n.png" alt="optionImg" class="optionBtn"/></div></div>' + '</div>' + '</div>' + ' <div id="ballCoverage"><div id="progressBall" class="progressBallInitial" > </div></div>' + '</div>');
        $("#lgVid_control").children().each(function (i) {
            switch ($(this).attr("id")) {
                case "stop":
                    addEventHandler(this, "click", function () {
                        _this.stop();
                    });
                    break;
                case "play":

                    addEventHandler(this, "click", function () {
                        _this.play();
                    });
                    break;
                case "forward":
                    addEventHandler(this, "click", function () {
                        _this.fastForward();
                    });
                    break;
                case "rewind":
                    addEventHandler(this, "click", function () {
                        _this.rewind();
                    });
                    break;
                case "switchToFullScreenMode":
                    addEventHandler(this, "click", function () {
                        _this.switchToFullScreenMode();
                    });
                    break;
                case "option":
                    addEventHandler(this, "click", function () {
                        _this.optionMedia();
                    });
                    break;
            }
        });
        setControlButton();

    }

    /*
     * Function addEventHandler() @param -elem- control button element @param
     * -eventType-type of event @param -handler- event handler method
     * @Description - it will call event handler method. Returns -void
     */

    addEventHandler = function (elem, eventType, handler) {
        if (elem.addEventListener) elem.addEventListener(eventType, handler, false);
        else if (elem.attachEvent) elem.attachEvent('on' + eventType, handler);
    }


    /*
     * Function toast() @param -msg-the message shows to user @Description - it
     * will inform user about functionalities and error by message. Returns
     * -void
     */

    toast = function (msg) {
        var container = containerDiv;
        var maxW = $(container).width();
        var maxH = $(container).height();

        var msgW = 0.2 * maxW;
        var msgH = 0.2 * maxH;

        $("<div>" + msg + "</div>").css({
            "display": "block",
			"width": msgW,
			"heigth": msgH,
			"opacity": 0.86,
			"border-radius": "10px",
			"top": (maxH / 2) - (msgH / 2),
			"left": (maxW / 2) - (msgW / 2),
			"overflow": "hidden",
			"position": "absolute",
			"background-color": "#111",
			"z-index": "auto",
			"text-align": "center",
			"color": "#EEE",
			"border": "#BBB 1px solid"
        }).appendTo(container).delay(1500).fadeOut(400, function () {
            $(this).remove();
        });
    };

    /*
     * Function showControl()
     * @param -str-the slideShow mode is activated or not
     * @Description - it will show and hide cotrol buttons based on the slideshow status.
     * Returns  -void
     */
    showControl = function () {
        if (fullScreenMode) {
            $("#option").css("display", "block");

            $("#lgVid_control").children().each(function (i) {
                $(this).css({
                    "width": "16.66%"
                });
            });


        } else {
            $("#option").css("display", "none");
            $("#lgVid_control").children().each(function (i) {
                $(this).css({
                    "width": "20%"
                });
            });

        }
    };
    mouseControl = function () {
        /********************************************* ProgressBall **************************/
        /* on mouseenter of progressBall class, change to progressBallHover class */
        $("#progressBall").on("mouseenter", function (event) {
            if (video.playState == 1 || video.playState == 2) {
                resetFocus();
                $(this).toggleClass("progressBallHover");
                $(".progressBallHover").css({
                    "width": ratioWidth * 104,
                        "height": ratioHeight * 60
                });
                rowID = 2;
                $(".progressBallHover").draggable({
                    axis: 'x',
                    disabled: false,
                    containment: '#ballCoverage',
                    start: function (event, ui) {
                        dragged = true;
                    },
                    stop: function (event, ui) {
                        var xmove = ui.position.left;
                        var seekedTime = (xmove / $(".progressBg").width()) * videoPlayInfo.duration;
                        video.seek(seekedTime);
                        video.playState == 2 ? _this.play() : "";
                    }
                });
            }
        });
        $("#progressBall").on("mouseleave", function (event) {
            $(".progressBallHover").draggable("disable");
        });
        /* on clicking on progressBar, progressBall moves & video plays from where progressBall will be pointing*/
        $("#progressBarClick").on("click", function (e) {
            if (video.playState == 1) {
                var xmove = e.pageX - $(this).offset().left;
                var seekedTime = (xmove / $(".progressBg").width()) * videoPlayInfo.duration;
                video.seek(seekedTime);
            }
        });
    };
    /*
     * Function getVideo() @param- none @Description- gets the object of video
     * Returns- video object
     */
    getVideo = function () {
        return document.getElementById('video');
    };

    checkPlayerDimensions = function () {
        // check if player dimensions are not less than minimum height and width
        if ((containerWidth < minPlayerWidth) || (containerHeight < minPlayerHeight)) {
            $(containerDiv).css({
                height: minPlayerHeight,
                width: minPlayerWidth
            });
            return;
        }


        var t = containerWidth / 16;
        if (containerHeight != (t * 9)) {
            $(containerDiv).css('height', (t * 9));
        }
        containerHeight = $(containerDiv).height();
    };

    checkFileExtensions = function (url) {
        // .mp4, .mpeg, .wmv, .asf
        for (var i = 0; i < supportedMimeTypes.length; i++) {
            if (url.lastIndexOf(supportedMimeTypes[i]) > 0) {
                return true;
            }
        }
        return false;

    };

    getSupportedVideoFiles = function (vidPath) {
        videoPath = vidPath;
        checkFileExtensions(videoPath) ? _this.play() : toast("Video File not Supported");
    };

    keyNavigation = function () {
        var allMenuObject;
        var arrowRowObj = [];
        var arrowIndex = 0;
        var cntIndex = 1;
        var tempcntIndex = -1;
        var hideTimerId = 1;
        allMenuObject = new Array();
        //on mousemove, show player controls
        $(containerDiv).on("mousemove", function (event) {
            showPlayer();
            triggerHide();
        });

        $("#lgVid_control").children().each(function (i) {
            allMenuObject.push($(this));

        });

        $(allMenuObject[1]).toggleClass("ctrlButtonHover");
        objectFocussed = allMenuObject[1];
        //on mouseenter change the button color using classes of each control button respectively
        $("#lgVid_control").children().each(function (i) {
            $(this).on("mouseenter", function (event) {
                resetFocus();
                $(this).toggleClass("ctrlButtonHover");
                rowID = 1;
                cntIndex = i;
                objectFocussed = allMenuObject[i];
            });
        });

        $(document).keydown(function (event) {
            var key = event.keycode || event.which;
            switch (key) {
                case VK_RIGHT:
                    setFocus(1);
                    break;
                case VK_LEFT:
                    setFocus(-1);
                    break;
                case VK_UP:
                    if (rowID < 2 && video.playState != 5) rowID++;
                    setFocus(0);
                    break;
                case VK_DOWN:
                    if (rowID > 1) {
                        rowID--;
                    }
                    if (video.playState == 2 && rowID == 2) rowID = 1;

                    setFocus(0);
                    break;
                case VK_ENTER:
                    buttonClicked();
                    break;
            }
            showPlayer();
            triggerHide();
        });
        /*
Function setFocus()
@param -button index
@Description - This changes the color of the button from normal to focus (mouse over or remote keynavigation)
Returns  -void
*/
        setFocus = function (idx) {
            if (rowID == 1) {
                if (allMenuObject[cntIndex + idx] != undefined && allMenuObject[cntIndex + idx].is(':visible')) {
                    resetFocus();
                    cntIndex = cntIndex + idx;
                    $(allMenuObject[cntIndex]).addClass("ctrlButtonHover"); //"viewButtonHover");
                    objectFocussed = allMenuObject[cntIndex];
                }

            } else if (rowID == 2) {
                if (idx != 0) idx == 1 ? _this.fastForward() : _this.rewind();
                else {
                    resetFocus();
                    $("#progressBall").addClass("progressBallHover");
                    $(".progressBallHover").css({
                        "width": ratioWidth * 104,
                            "height": ratioHeight * 60
                    });
                }
            }
        }
        /*Function buttonClicked()
		@param -chnlNo-the current selected HTML object
		@Description - This function implements the on Enter function of remote.
		Returns  -void
*/
        buttonClicked = function () {
            if (rowID != 2) {
                var buttonId = $(objectFocussed).attr("id");
                var event = document.createEvent("MouseEvent");
                event.initEvent("click", true, true);
                document.getElementById(buttonId).dispatchEvent(event);
            }

        };

    };
    /*
Function resetFocus()
@param - none
@Description - This changes the color of the button from focus to noramal (mouse over or remote keynavigation)
Returns  -void
*/
    resetFocus = function () {
        $("#lgVid_control").children().each(function (i) {
            $(this).removeClass("ctrlButtonHover");
        });
        $(this).toggleClass("progressBallHover");
        $(".progressBallHover").css({
            "width": ratioWidth * 71,
                "height": ratioHeight * 44
        });
        $("#progressBall").removeClass("progressBallHover");

    }

    /*Function resetProgress()
@param- none
@Description- resets all the functionalities, when video is stopped or video is finished
Returns- none
*/
    resetProgress = function () {
		if(bControlsAdded){
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
			$("#playBtn > img").remove();
			$('#playBtn').append('<img src="assets/VideoPlayer/ui/images/player_btn_icon/movie_btn_icon_play_n.png" alt="playImg" class="playBtn" align="center" />');
			$("#remainingTime").text("");
			$("#totalTime").text("");
			$(".runningMovieName").text("");
			$(".runningMovieType").text("");
			resetFocus();
			cntIndex = 1;
			rowID = 1;
			objectFocussed = $('#play');
			$('#play').toggleClass("ctrlButtonHover");
			bufferWidthRatio=0;
		}
    }
    /*
Function triggerHide()
@param -none
@Description - This triggers the hide function in 5 seconds
Returns  -void
*/
    triggerHide = function () {
        if (video.playState == 1 || video.playState == 4) {
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
    hidePlayer = function () {
        $(".playerBottom").hide(100);
    }

    /*
Function showPlayer()
@param -none
@Description - function to show the player controls
Returns  -void
*/
    showPlayer = function () {
        $(".playerBottom").show()
    }

    // Constructor invoke
    this._construct();
}
