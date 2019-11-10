//device = document.getElementById("device");
//console.log(device.serialNumber);
//console.log(device.modelName);

var app = new lge();
app.createVideoPlayer($("#videoplayer_debug"), true, "assets/media/testing.mp4");
app.play();

//document.getElementById("output").innerHTML += "Your serial number is: " + device.serialNumber + " and your modelName is: " + device.modelName;
