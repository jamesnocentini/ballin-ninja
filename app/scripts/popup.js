'use strict';

var statusDisplay = null;

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
  // Cache a reference to the status display SPAN
  statusDisplay = document.getElementById('status-display');
});

// Do NOT forget that the method is ASYNCHRONOUS
chrome.tabs.query({
  active: true,               // Select active tabs
  lastFocusedWindow: true     // In the current window
}, function(array_of_Tabs) {
  // Since there can only be one active tab in one active window,
  //  the array has only one element
  var tab = array_of_Tabs[0];
  // Example:
  var url = tab.url;
  // ... do something with url variable
  if (url.indexOf('youtube.com') > -1) {
    var id = url.split("?v=")[1].substring(0, 11);
    sendVideoId(id, tab.title)
  }
});


// POST the data to the server using XMLHttpRequest
function sendVideoId(id, title) {

  // The data to send to the server
  var data = {
    video_id: id,
    type: 'video',
    title: title,
    created_at: new Date().getTime()
  };

  // The URL to POST our data to
  var postUrl = 'http://178.62.81.153:4984/editor/' + id;

  // Set up an asynchronous AJAX POST request
  var xhr = new XMLHttpRequest();
  xhr.open('PUT', postUrl, true);

  // Set correct header for form data
  xhr.setRequestHeader('Content-Type', 'application/json');

  // Handle request state change events
  xhr.onreadystatechange = function() {
    // If the request completed
    if (xhr.readyState == 4) {
      statusDisplay.innerHTML = '';
      if (xhr.status == 200) {
        // If it was a success, close the popup after a short delay
        statusDisplay.innerHTML = 'Saved!';
        window.setTimeout(window.close, 1000);
      } else {
        // Show what went wrong
        statusDisplay.innerHTML = 'Error saving: ' + xhr.statusText;
      }
    }
  };

  // Send the request and set status
  xhr.send(JSON.stringify(data));
  statusDisplay.innerHTML = 'Saving...';
}