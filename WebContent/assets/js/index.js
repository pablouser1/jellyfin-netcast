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

	console.log("IP: " + ip + " Port: " + port + " User: " + user + " API: " + api)
  whole_url= "http://" + ip + ":" + port
  //Get User's ID
  loadJSON(whole_url + "/emby/Users/Public",
         function(data){
           id = data[0].Id; // At the moment the code can only check your Id in section 0
           console.log("Tu ID es: " + id);
         },
         function(xhr) { console.error(xhr); }
  );

	//Hide login form and show main menu and continue watching menus.
  var x = document.getElementById("login");
	x.style.display = "none";
  var y = document.getElementById("content");
	y.style.display = "block";
}

function back(){
  document.getElementById("items").innerHTML = "";
  var x = document.getElementById("content");
  x.style.display = "block";
  var y = document.getElementById("items");
  y.style.display = "none";
}

function content(clicked_id){
  content_type = clicked_id;
  var x = document.getElementById("content");
  x.style.display = "none";
  var y = document.getElementById("items");
  y.style.display = "block";
  var z = document.getElementById("top");
  z.style.display = "block";
  console.log("Button clicked: " + clicked_id);
  if (clicked_id === "movies_img"){
    getmovies();
  }
  else if (clicked_id === "tv_img"){
    gettv();
  }
  else if (clicked_id === "music_img"){
    getmusic();
  }
  else {
    alert("I don't know which button you clicked");
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

function gettv(){
  loadJSON(whole_url + "/emby/Users/" + id + "/Items?api_key=" + api + "&Recursive=true&CollectionType=tvshows&includeItemTypes=Series&SortBy=SortName", //http://192.168.1.5:8096/emby/Users/c13f8113bf02412b97c193e1ec73d960/Items?api_key=24f18d49ae0149749a595363e4b48e10
         function(data){
           tv = data;
           var i = 0;
           while (i < data.Items.length) {
             console.log(i + " " + data.Items[i].Name);
             document.getElementById("items").innerHTML += "<a href='javascript:videoplayer(tv.Items[" + i +"].Id)''>" + "<img src=" + whole_url + "/emby/Items/" + data.Items[i].Id + "/Images/Primary width=180 height=270>";
             i++;
           }
         },
         function(xhr) { console.error(xhr); }
);
}

function getmusic(){
  loadJSON(whole_url + "/emby/Users/" + id + "/Items?api_key=" + api + "&Recursive=true&CollectionType=music&includeItemTypes=Audio&SortBy=SortName",
         function(data){
           music = data;
           var i = 0;
           while (i < data.Items.length) {
             console.log(i + " " + data.Items[i].Name);
             document.getElementById("items").innerHTML += "<a href='javascript:videoplayer(music.Items[" + i +"].Id)''>" + "<img src=" + whole_url + "/emby/Items/" + data.Items[i].Id + "/Images/Primary width=270 height=270>" + data.Items[i].Name;
             i++;
           }
         },
         function(xhr) { console.error(xhr); }
);
}
function videoplayer(id_item){
  console.log(id_item);
  var x = document.getElementById("items");
  x.style.display = "none";
  var y = document.getElementById("player");
  y.style.display = "block";
  if (content_type === "movies_img"){
    document.getElementById('player').innerHTML = "<embed src='" + whole_url + "/emby/Videos/" + id_item +  "/stream.mp4'/>"
  }
  else if (content_type === "music_img"){
      // HTML5 way (Not working with TV)--> document.getElementById('player').innerHTML = "<audio controls><source src='" + whole_url + "/emby/Audio/" + id_item +  "/stream.mp3'></audio>"
      document.getElementById('player').innerHTML = "<embed src='" + whole_url + "/emby/Audio/" + id_item +  "/stream.mp3'/>"
    }
  else {
    alert("I don't know what id is");
  }
}
