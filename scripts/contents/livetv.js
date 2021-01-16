function getChannelCard() {

}

function loadChannels() {
    loadJSON("/LiveTv/Channels?startIndex=" + startIndex + "&Fields=PrimaryImageAspectRatio&Limit=100&UserId=" + userinfo.id,
        function (data) {

        },
        function (error) {

        }
    )
}
