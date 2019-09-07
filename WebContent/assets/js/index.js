var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

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
    jsonstart();
}

function jsonstart(){
	getJSON('http://' + ip + ':' + 'port' + '/emby/Users/public',
  function(err, data) {
  if (err !== null) {
    alert('Something went wrong: ' + err);
  }
	else {
    console.log('Your query count: ' + data.query.count);
  }
});
}
