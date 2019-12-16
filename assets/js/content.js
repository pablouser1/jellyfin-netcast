function showlibrary(){
  //Get all libraries and display them, with their respective image.
  loadJSON(whole_url + "/jellyfin/Users/" + id + "/Views", "GET", "true",
    function(data) {
      var i = 0;
      while (i < data.Items.length) {
        console.log(i + " " + data.Items[i].Name);
        $(content_table).find("tbody").append("<td><img id='" + data.Items[i].UserData.Key + "' class='" + data.Items[i].CollectionType + "' src='" + whole_url + "/jellyfin/Items/" + data.Items[i].Id + "/Images/Primary' width=360 height=202 onClick='content(this.id, this.className);'</td>");
        $(content_table).find("tfoot").append("<td>" + data.Items[i].Name + "</td>");
        i++;
      }
    },
    function(xhr) {
      console.error(xhr);
    }
  );

  //Get all continue watching and display them, with their respective image.
  loadJSON(whole_url + "/jellyfin/Users/" + id + "/Items?Limit=20&Recursive=true&SortBy=DatePlayed&SortOrder=Descending&Filters=IsResumable", "GET", "true",
    function(data) {
      var i = 0;
      while (i < data.Items.length) {
        console.log(i + " " + data.Items[i].Name);
        $(watching_table).find("tbody").append("<td><img src='" + whole_url + "/jellyfin/Items/" + data.Items[i].Id + "/Images/Primary' width=360 height=202</td>");
        $(watching_table).find("tfoot").append("<td>" + data.Items[i].SeriesName + " - " + data.Items[i].Name + "</td>");
        i++;
      }
    },
    function(xhr) {
      console.error(xhr);
    }
  );
}

function content(content_id, content_class){
  document.getElementById("items").innerHTML = ""
  content_id_global = content_id
  $("#content").hide();
  $("#items").show();
  $("#watching").hide();
  parent.location.hash = "#items";
  loadJSON(whole_url + "/jellyfin/Users/" + id + "/Items?ParentId=" + content_id + "&SortBy=SortName", "GET", "true",
    function(data) {
      if (content_class == "tvshows"){
        var i = 0;
        while (i < data.Items.length) {
          console.log(i + " " + data.Items[i].Name);
          document.getElementById("items").innerHTML += "<img id='" + data.Items[i].Id + "' src='" + whole_url + "/jellyfin/Items/" + data.Items[i].Id + "/Images/Primary' width=180 height=270 onClick='seasons(this.id);'</img>";
          i++;
        }
      }
      if (content_class == "movies"){
        var i = 0;
        while (i < data.Items.length) {
          console.log(i + " " + data.Items[i].Name);
          document.getElementById("items").innerHTML += "<img id='" + data.Items[i].Id + "' src='" + whole_url + "/jellyfin/Items/" + data.Items[i].Id + "/Images/Primary' width=180 height=270 onClick='play(content_id_global);'</img>";
          i++;
      }
      }
    },
    function(xhr) {
      console.error(xhr);
    }
  );
}
