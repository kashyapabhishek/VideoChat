 "use strict";



 // ------------------ WebRT simple-peer ------------------------//

 
navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

navigator.getUserMedia({ video: true, audio: false }, async function (stream) {

  var peer = new SimplePeer({
      initiator: location.hash == '#init',
      trickle: false,
      stream: stream
  });

  peer.on('signal', function (data) {
      document.getElementById('yourid').value = JSON.stringify(data);
      connection.invoke("SendMessage", sessionStorage.getItem('localusername'), JSON.stringify(data)).catch(function (err) {
                return console.error(err.toString());
      });
  });

  document.getElementById('connect').addEventListener('click', function () {
      var orderid = JSON.parse(document.getElementById('otherid').value)
      peer.signal(orderid)
  });

  //connect on oneload if any one is in init mode
  
  document.getElementById('send').addEventListener('click', function () {
      var yourmessage = document.getElementById('yourmessage').value
      peer.send(yourmessage);
  });

  peer.on('data', function (data) {
      document.getElementById('message').textContent += data + '\n'
  });
  peer.on('stream', function (stream) {
      var video = document.createElement('video')
      video.setAttribute("style", "width: 100% !important");
      document.getElementById('videolink').appendChild(video);
      video.srcObject = stream
      video.play();
  })
},
  function (err) {
      console.log(err);
  });

  //------------------------ WebRT single-peer End-------------------------------//

 ////////////////// make singalR connection ////////////////////////////////
 var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

 /////////////////// Start the signalR services ////////////////////////////
connection.start().then(function () {

}).catch(function (err) {
    return console.error(err.toString());
});

////////////////////  make call or send message ////////////////////////

function myFunction() {
  var person = prompt("Please Enter reciver id");
  if (person != null) {
    return person
  }
  return null;
}

document.getElementById("makecall").addEventListener("click", function (event) {
  var returnMsg = myFunction();
  if(returnMsg != null)
  {
    sessionStorage.setItem("localusername",returnMsg);
    location.href = '/#init';
    location.reload();
  }else{
    alert("Enter the reciver id");
  }
  event.preventDefault();
});

 ////////////////////// Recieve The message  ///////////////////////////////
connection.on("ReceiveMessage", function (username, message) {
  console.log("recievedMessage"+username+":"+message);
    var orderid = JSON.parse(message)
    if(username != sessionStorage.getItem("localusername")){
      peer.signal(orderid)
    }  
});

