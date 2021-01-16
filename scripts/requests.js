/**
 * Get JSON from server
 * @param {string} path Request path
 * @param {string} type Request type (GET, POST, PUT, DELETE)
 * @param {function} success Function when request works
 * @param {function} error Function when request fails
 * @param {string} data JSON-encoded data body (optional, only when using POST)
 */
function loadJSON(path, type, success, error, data) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) {
                    success(JSON.parse(xhr.responseText));
                }
            }
            else if (xhr.status === 204) {
                if (success) {
                    success("Sent without response body")
                }
            }
            else {
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
