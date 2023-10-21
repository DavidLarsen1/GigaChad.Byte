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

  // Clear any previous content in the screenshotBox and add the new screenshot
  screenshotbox.innerHTML = '';
  screenshotbox.appendChild(screenshotImage);
});
});





// experamental screenshot download
// Function to download content of elements with the "download-content" class as an image
document.getElementById("save").addEventListener("click", function () {
  // Find the element with the class "download-content"
  const downloadContent = document.querySelector(".download-content");

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











