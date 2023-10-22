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


// add text here
const submit = document.getElementById('submitButton');
const question = document.getElementById('questionText')
submit.addEventListener("click", e => {
  e.preventDefault();
  if (question.value === "") {return};
  socket.emit('submit-question', question.value);
  question.value = "";
});




// new screenshot type that only sends to id screenshotbox and takes from client-screen
document.addEventListener("DOMContentLoaded", () => {
const takeScreenshotButton = document.getElementById("takeScreenshotButton");
const clientScreen = document.getElementById("client-screen");
const screenshotbox = document.getElementById("screenshotbox");

// Take a screenshot and display it in the screenshotBox
takeScreenshotButton.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = clientScreen.videoWidth;
  canvas.height = clientScreen.videoHeight;

  const context = canvas.getContext('2d');
  context.drawImage(clientScreen, 0, 0, canvas.width, canvas.height);

  const screenshotImage = new Image();
  screenshotImage.src = canvas.toDataURL('image/png');
  screenshotImage.id = 'screenShot'; // Set the id

  // Clear any previous content in the screenshotBox and add the new screenshot
  screenshotbox.innerHTML = '';
  screenshotbox.appendChild(screenshotImage);
});
});





// experimental screenshot download
// Function to download content of elements with the "download-content" class as an image
document.getElementById("save").addEventListener("click", function () {
  // Find the element with the class "download-content"
  const downloadContent = document.getElementById("screenshotbox");

  // Use html2canvas to capture a screenshot of the element
  html2canvas(downloadContent).then(function (canvas) {
      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL("image/png");

      // Create a temporary link to trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = dataURL;
      downloadLink.download = "screenshot.png";

      // Trigger the click event on the link to initiate the download
      downloadLink.click();
  });
});



const canvas = document.getElementById("screenshotCanvas");
const ctx = canvas.getContext('2d');
const whiteboardButton = document.getElementById("whiteboardButton");
let whiteboard = false;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// whiteboard functionallity:
// whiteboardButton.addEventListener('click', () => {
//   if (!whiteboard) {
//     whiteboard = true
//   }
//   else {
//     whiteboard = false
//   } return
// });

// function startDrawing(e) {
//   isDrawing = true
//   [lastX, lastY] = [e.clientX, e.clientY]
// }

// function draw(e) {
//   if (!isDrawing) return;
//     ctx.beginPath();
//   ctx.strokeStyle = "black";
//   ctx.lineWidth = 2;
//   ctx.moveTo(lastX, lastY);
//   ctx.lineTo(e.clientX, e.clientY);
//   ctx.stroke();
//   [lastX, lastY] = [e.clientX, e.clientY]
// }
// if (whiteboard) {
// canvas.addEventListener('mousedown', startDrawing);
// canvas.addEventListener('mousemove', draw);
// canvas.addEventListener('mouseup', () => isDrawing = false);
// canvas.addEventListener('mouseout', () => isDrawing = false);
// canvas.addEventListener('touchstart', (e) => {
//   e.preventDefault();
//   startDrawing(e.touches[0]);
// });
// canvas.addEventListener('touchmove', (e) => {
//   e.preventDefault();
//   draw(e.touches[0])
// });
// canvas.addEventListener('touched', () =>
// isDrawing = false);
// canvas.addEventListener('touchcancel', () =>
// isDrawing = false);
// }



// // Create a function for the text bubble button.
// const bubbleButton = document.getElementById('bubbleButton');
// bubbleButton.addEventListener('click', () => {
//   const bubble = document.createElement("div");
//   bubble.classname.add('bubble');
//   const content = document.createElement("div");
//   bubble.classname.add('content');
//   canvas.appendchild(bubble)
//   bubble.appendchild(content)
// });

// let isDragging = false;
// let initialX;
// let initialY;

// const bubble = document.querySelector(".bubble");
// const handle = document.querySelector(".handle");

// handle.addEventListener("mousedown", (e) => {
//   isDragging = true;
//   initialX = e.clientX - bubble.getBoundingClientRect().left;
//   initialY = e.clientY - bubble.getBoundingClientRect().top;
// });

// document.addEventListener("mousemove", (e) => {
//   if (!isDragging) return;

//   const newX = e.clientX - initialX;
//   const newY = e.clientY - initialY;
//   bubble.style.left = newX + "px";
//   bubble.style.top = newY + "px";
// });
// document.addEventListener("mouseup", () => {
//   isDragging = false;
// });