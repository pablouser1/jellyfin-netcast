function login() {

	ip=document.getElementById("ip").value;

	port=document.getElementById("port").value;

	user=document.getElementById("user").value;

	api=document.getElementById("api").value;
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
    movielist();
}

function movielist(){
	document.getElementById("insert").innerHTML = ip;
	$.getJSON("http://" + ip + ":" + port + "/emby/Users/Public", function(getid) {

	    //getid is the JSON string

		id = getid[0].Id;

		document.write(ip);

		$.getJSON("http://" + ip + ":" + port + "/emby/Users/" + id + "/Items?api_key=" + api + "&Recursive=true&IncludeItemTypes=Movie", function(getmovies) {
		    //getmovies is the JSON string
				alert("WIP");
		})



	})
}
