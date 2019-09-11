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

	console.log("IP: " + ip + " Port: " + port + " User: " + user + " API: " + api);
  whole_url= "http://" + ip + ":" + port
	//Hide login form and show Movies
  var x = document.getElementById("login");
	x.style.display = "none";
  var y = document.getElementById("main");
	y.style.display = "block";
  loadJSON(whole_url + "/emby/Users/Public",
         function(data){
           id = data[0].Id; // At the moment the code can only check your Id in section 0
         },
         function(xhr) { console.error(xhr); }
);
}


function main(clicked_id){
  var x = document.getElementById("main");
  x.style.display = "none";
  var y = document.getElementById("items");
  y.style.display = "block";
  console.log("Button clicked: " + clicked_id);
  if (clicked_id = "movies"){
    getmovies();
  }
}

function getmovies(){
	loadJSON(whole_url + "/emby/Users/" + id + "/Items?api_key=" + api + "&Recursive=true&IncludeItemTypes=Movie",
         function(data){
           movies = data;
					 var i = 0;
					 while (i < data.Items.length) {
						 console.log(i + " " + data.Items[i].Name);
						 document.getElementById("items").innerHTML += "<a href='javascript:videoplayer(movies.Items[" + i +"].Id)''>" + "<img src=" + whole_url + "/emby/Items/" + data.Items[i].Id + "/Images/Primary width=180 height=270>";
						 i++;
					 }
				 },
         function(xhr) { console.error(xhr); }
);
}

function videoplayer(id_video){
  console.log(id_video);
  var x = document.getElementById("items");
  x.style.display = "none";
  var y = document.getElementById("player");
  y.style.display = "block";
  //document.getElementById('vid').source = whole_url + "/emby/Videos/" + id + "/stream.mp4";
}
