"use strict";

// ------------------------------Extract the query string from URL or iframe ----------------------------------//

if(location.href.includes('?')){
  let params =  location.href.split('?')[1].split('=')[1];
  sessionStorage.setItem('localusername', params);
}

 // Make singalR connection object
 var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

 // Start the signalR Hub connetion
connection.start().then(function () {

}).catch(function (err) {
    return console.error(err.toString());
});


// Get the borwser media for Chrome, firefox, IE
navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
  
// Gate the borwser media with video and audio capacity 
navigator.getUserMedia({ video: true, audio: true },gotMedia, () => {});


// function to take MediaStream and with SimplePeer Make P2P connection.
async function gotMedia(stream){

  // create a SimplePeer object (peer) with initiator URL start with https://<url:port>?#init
  var peer = new SimplePeer({
    initiator: location.hash == '#init',
    trickle: false,
    stream: stream
    });

    // Generate the Networkin information for the data transmission 
    peer.on('signal', function (data) {
            connection.invoke("SendMessage", sessionStorage.getItem('localusername'), sessionStorage.getItem('callerusername'),  JSON.stringify(data)).catch(function (err) {
                return console.error(err.toString());
             });
    });

    // Get stream and push the video content on the web page in vido tage 
    peer.on('stream', function (stream) {
      document.getElementById('tempvideo').remove(); // remove the existing video tag
        var video = document.createElement('video') // create new video tag
        video.setAttribute("style", "width: 100% !important");
        video.controls = true;
        video.poster = "~/images/callingimage.png";
        document.getElementById('videolink').appendChild(video);
        video.srcObject = stream
        video.play();
    })

    // signal r connection On ReceiveMessage set the local username , callerusername and call the signal to create the networking information for the othe rought
    connection.on("ReceiveMessage", function (caller,reciver, message) {
        console.log("recievedMessage"+reciver+"::"+caller);
          var orderid = JSON.parse(message)
          if(sessionStorage.getItem('localusername') === reciver){
              sessionStorage.setItem('callerusername', caller);
            peer.signal(orderid)
          }  
      });
  
  }

// Simple function for prompt to ask reciver id
function myFunction() {
    var person = prompt("Please Enter reciver id");
    if (person != null) {
      return person
    }
    return null;
  }
  
// Function to take reciver id and set the callerusername
  function call(){
    var returnMsg = myFunction();
    if(returnMsg != null)
    {       
      sessionStorage.setItem("callerusername",returnMsg);
      location.href = '/#init';
      //location.reload();
    }else{
      alert("Enter the reciver id");
    }
  }

  // work click event for makevideo call 
  document.getElementById("makevideocall").addEventListener("click", function (event) {
    call();
    event.preventDefault();
  });
  
  // click event for makeaudio call  -- (this is not emplimented right now)
  document.getElementById('makecall').addEventListener('click', function(event){
      call();
    event.preventDefault();
  });
