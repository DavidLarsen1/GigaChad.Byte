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
