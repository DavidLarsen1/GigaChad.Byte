// particpant.js
'use strict';
const socket = io();
const peer = new RTCPeerConnection({
iceServers: [
{
  urls: "stun:stun.relay.metered.ca:80",
},
{
  urls: "turn:a.relay.metered.ca:80",
  username: "68099be6bbbd15dd03361092",
  credential: "DupS1hUdUGzwahXt",
},
{
  urls: "turn:a.relay.metered.ca:80?transport=tcp",
  username: "68099be6bbbd15dd03361092",
  credential: "DupS1hUdUGzwahXt",
},
{
  urls: "turn:a.relay.metered.ca:443",
  username: "68099be6bbbd15dd03361092",
  credential: "DupS1hUdUGzwahXt",
},
{
  urls: "turn:a.relay.metered.ca:443?transport=tcp",
  username: "68099be6bbbd15dd03361092",
  credential: "DupS1hUdUGzwahXt",
},
  ],
});

const video = document.getElementById('client-screen');
peer.addEventListener('track', (track) => {
  video.srcObject = track.streams[0];
});

socket.on('offer', async (clientSDP) => {
  await peer.setRemoteDescription(clientSDP);

  const sdp = await peer.createAnswer();
  await peer.setLocalDescription(sdp);
  socket.emit('answer', peer.localDescription);
});

peer.addEventListener('icecandidate', (event) => {
  if (event.candidate) {
    socket.emit('icecandidate', event.candidate);
  }
});
socket.on('icecandidate', async (candidate) => {
  await peer.addIceCandidate(new RTCIceCandidate(candidate));
});


// This Code is not needed, but could be used to improve share screen in the future.
// let sharingInterval;
// const shareScreenButton = document.getElementById("shareScreenButton");
// const localScreen = document.getElementById("localScreen");
// const sharedCanvas = document.getElementById("sharedCanvas");

// shareScreenButton.addEventListener("click", () => {
//   if (!sharingInterval) {
//     // Start screen sharing
//     sharingInterval = setInterval(shareWebpage, 1000);
//     shareScreenButton.textContent = "STOP SHARING";
//   } else {
//     // Stop screen sharing
//     clearInterval(sharingInterval);
//     sharingInterval = null;
//     shareScreenButton.textContent = "START SHARING";
//   }
// });

// function shareWebpage() {
//   // Capture the webpage content and share it
//   const context = sharedCanvas.getContext("2d");
//   sharedCanvas.width = window.innerWidth;
//   sharedCanvas.height = window.innerHeight;
//   context.drawImage(document.documentElement, 0, 0, window.innerWidth, window.innerHeight);

//   const dataURL = sharedCanvas.toDataURL("image/jpeg", 0.7);
// }






// add text here
const submit = document.getElementById('submitButton');
const question = document.getElementById('questionText')
submit.addEventListener("click", e => {
  e.preventDefault();
  if (question.value === "") {return};
  socket.emit('submit-question', question.value);
  question.value = "";
});







// this is for screen shots of the preivew
const takeScreenshotButton = document.getElementById("takeScreenshotButton");
const clientScreen = document.getElementById("client-screen");
const screenshotCanvas = document.getElementById("screenshotCanvas");
const screenshotList = document.getElementById("screenshotList");

let screenshotCount = 1;
let lastScreenshot;

// Take a screenshot and display it
takeScreenshotButton.addEventListener("click", () => {
  const context = screenshotCanvas.getContext('2d');
  screenshotCanvas.width = clientScreen.videoWidth;
  screenshotCanvas.height = clientScreen.videoHeight;
  context.drawImage(clientScreen, 0, 0, screenshotCanvas.width, screenshotCanvas.height);

  // Create a new image element for the screenshot or update the existing one
  if (lastScreenshot) {
    lastScreenshot.src = screenshotCanvas.toDataURL('image/png');
  } else {
    lastScreenshot = new Image();
    lastScreenshot.src = screenshotCanvas.toDataURL('image/png');
    lastScreenshot.style.display = "block";
    screenshotList.appendChild(lastScreenshot);
  }
});




  const canvas = document.getElementById("screenshotCanvas");
  const ctx = canvas.getContext('2d');
  const whiteboardButton = document.getElementById("whiteboardButton");
  let whiteboard = false;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  whiteboardButton.addEventListener('click', () => {
    if (!whiteboard) {
      whiteboard = true
    }
    else {
      whiteboard = false
    } return
  });

  
  
  function startDrawing(e) {
    isDrawing = true
    [lastX, lastY] = [e.clientX, e.clientY]
  }

  function draw(e) {
    if (!isDrawing) return;
      ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    [lastX, lastY] = [e.clientX, e.clientY]
  }
  if (whiteboard) {
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseout', () => isDrawing = false);
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrawing(e.touches[0]);
  });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e.touches[0])
  });
  canvas.addEventListener('touched', () =>
  isDrawing = false);
  canvas.addEventListener('touchcancel', () =>
  isDrawing = false);
  }


// Create a function for the text bubble button.
const bubbleButton = document.getElementById('bubbleButton');
bubbleButton.addEventListener('click', () => {
  const bubble = document.createElement("div");
  bubble.classname.add('bubble');
  const handle = document.createElement("div");
  bubble.classname.add('handle');
  const content = document.createElement("div");
  bubble.classname.add('content');
  canvas.appendchild(bubble)
  bubble.appendchild(handle)
  bubble.appendchild(content)
});

// Chat GPT gave this code for the classes above:
// .bubble {
//   position: absolute;
//   width: 200px;
//   background-color: #3498db;
//   border-radius: 10px;
//   cursor: move;
// }

// .handle {
//   width: 100%;
//   height: 20px;
//   background-color: #2980b9;
//   border-top-left-radius: 10px;
//   border-top-right-radius: 10px;
//   cursor: move;
// }

// .content {
//   padding: 10px;
//   color: #ffffff;
//   user-select: none;
// }

let isDragging = false;
let initialX;
let initialY;

const bubble = document.querySelector(".bubble");
const handle = document.querySelector(".handle");

handle.addEventListener("mousedown", (e) => {
  isDragging = true;
  initialX = e.clientX - bubble.getBoundingClientRect().left;
  initialY = e.clientY - bubble.getBoundingClientRect().top;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const newX = e.clientX - initialX;
  const newY = e.clientY - initialY;

  bubble.style.left = newX + "px";
  bubble.style.top = newY + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

