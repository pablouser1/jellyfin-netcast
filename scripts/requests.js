// JSON Loading
function loadJSON(path, type, success, error, data) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) {
                    success(JSON.parse(xhr.responseText));
                }
            } else {
                if (error) {
                    showToast("Error:" + error)
                    error(xhr);
                }
            }
        }
    };
    xhr.open(type, userinfo.host + path, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("X-Emby-Authorization", params);
    if (data) {
        xhr.send(data);
    }
    else {
        xhr.send()
    }
}
