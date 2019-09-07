// JSON Loading
function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
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


function login() {
  //Store Data
	ip=document.getElementById("ip").value;

	port=document.getElementById("port").value;

	user=document.getElementById("user").value;

	api=document.getElementById("api").value;

	//Hide login form and show Movies
  var x = document.getElementById("login");
  if (x.style.display === "none") {
		x.style.display = "block";
    }
		else {
      x.style.display = "none";
    }
    var y = document.getElementById("main");
    if (y.style.display === "none") {
	  y.style.display = "block";
	  }
	  else {
			y.style.display = "none";
	}
    getid();
}

function getid(){
	loadJSON('http://' + ip + ":" + port + "/emby/Users/Public",
         function(data){
					 id = data[0].Id; // At the moment the code can only check your Id in section 0
					 getmovies();
				 },
         function(xhr) { console.error(xhr); }
);
}

function getmovies(){
	loadJSON('http://' + ip + ":" + port + "/emby/Users/" + id + "/Items?api_key=" + api + "&Recursive=true&IncludeItemTypes=Movie",
         function(data){
					 var i = 0;
					 while (i < data.Items.length) {
						 document.write("<a href=" + "http://" + ip + ":" + port + "/emby/Videos/" + data.Items[i].Id + "/stream.mp4>" + data.Items[i].Name + "</a>" + "<p>");
						 i++;
					 }
					 movieslist = data.Items[0].Name;
				 },
         function(xhr) { console.error(xhr); }
);
}
