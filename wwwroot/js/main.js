"use strict";

//------------------------ WebRT single-peer End-------------------------------//

 ////////////////// make singalR connection ////////////////////////////////
 var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

 /////////////////// Start the signalR services ////////////////////////////
connection.start().then(function () {

}).catch(function (err) {
    return console.error(err.toString());
});

navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
  
  navigator.getUserMedia({ video: true, audio: true },gotMedia, () => {});


  async function gotMedia(stream){
      
  var peer = new SimplePeer({
    initiator: location.hash == '#init',
    trickle: false,
    stream: stream
    });

    peer.on('signal', function (data) {
            connection.invoke("SendMessage", sessionStorage.getItem('localusername'), sessionStorage.getItem('callerusername'),  JSON.stringify(data)).catch(function (err) {
                return console.error(err.toString());
             });


     
    });

    peer.on('stream', function (stream) {
        var video = document.createElement('video')
        video.setAttribute("style", "width: 100% !important");
        document.getElementById('videolink').appendChild(video);
        video.srcObject = stream
        video.play();
    })
    connection.on("ReceiveMessage", function (caller,reciver, message) {
        console.log("recievedMessage"+reciver+"::"+caller);
          var orderid = JSON.parse(message)
          if(sessionStorage.getItem('localusername') === reciver){
              sessionStorage.setItem('callerusername', caller);
            peer.signal(orderid)
          }  
      });
  
  }

   ////////////////////// Recieve The message  ///////////////////////////////



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
      sessionStorage.setItem("caller","yes");        
      sessionStorage.setItem("callerusername",returnMsg);
      location.href = '/#init';
      location.reload();
    }else{
      alert("Enter the reciver id");
    }
    event.preventDefault();
  });

  

document.getElementById('loginbutton').addEventListener('click', function(){
   var userid =  myFunction();
   sessionStorage.setItem("localusername", userid);
   document.getElementById('user').innerHTML = userid;

})
  