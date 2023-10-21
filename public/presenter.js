// presenter.js
'use strict';
const socket = io();
const peer = new RTCPeerConnection();

const viewTeacher = document.getElementById('viewTeacher');
viewTeacher.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: true,
      preferCurrentTab: true,
    });

    peer.addTrack(stream.getVideoTracks()[0], stream);

    const sdp = await peer.createOffer();
    await peer.setLocalDescription(sdp);
    socket.emit('offer', peer.localDescription);
  } catch (error) {

    console.error(error);
    alert(error.message);
  }
});

socket.on('answer', async (adminSDP) => {
  peer.setRemoteDescription(adminSDP);
});

peer.addEventListener('icecandidate', (event) => {
  if (event.candidate) {
    socket.emit('icecandidate', event.candidate);
  }
});


socket.on('icecandidate', async (candidate) => {
  await peer.addIceCandidate(new RTCIceCandidate(candidate));
});





// Question adding socket connection.
const questionContainer = document.getElementById("questionContainer");
socket.on('submit-question', (question) => {
  const message = document.createElement("p");
  message.textContent = question;
  questionContainer.appendChild(message);
});

// function to clear one question.
const clear1 = document.getElementById("clear1Button");
clear1.addEventListener("click", () => {
  questionContainer.removeChild(questionContainer.firstChild);
});

// function to clear all questions.
const clearAll = document.getElementById("clearAllButton");
clearAll.addEventListener("click", () => {
  questionContainer.innerHTML = "";
});
