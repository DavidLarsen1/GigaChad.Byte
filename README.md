# Chad View – Live Screen Sharing & Q&A Platform

**Chad View** is a real-time classroom and presentation tool that allows a presenter to share their screen with participants, receive questions, and manage interactions. Participants can view the shared screen, submit questions, take screenshots, annotate with notes, and download the combined image.

---

## **Features**

* **Live Screen Sharing:** Presenter shares their screen/video with participants via WebRTC.
* **Real-Time Q&A:** Participants can submit questions, which appear for the presenter to view and manage.
* **Screenshots with Notes:** Participants can take a screenshot of the shared screen, annotate it with notes directly on the screenshot, and download the combined image
* * **Question Management:** The Presenter can clear individual or all questions.
* **Responsive Design:** Works on desktop and mobile devices.

---

## **Technologies Used**

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express
* **Real-Time Communication:** WebRTC, Socket.io
* **Extras:** html2canvas (for saving screenshots)

---

## **Getting Started**

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/chad-view.git
cd chad-view
```

### **2. Install Dependencies**

```bash
npm install express socket.io
```

### **3. Start the Server**

```bash
node server.js
```

### **4. Open the Application**

* Presenter: `http://localhost:3000/presenter.html`
* Participant: `http://localhost:3000/participant.html`

> Make sure your browser allows screen capture for the presenter.

---

## **How It Works**

### **Presenter**

* Click **SHARE** to start screen sharing.
* View incoming questions in the Q&A section.
* Clear questions individually or all at once.
* Take notes in the notes section.

### **Participant**

* View the live screen feed from the presenter.
* Submit questions using the text area and **SUBMIT** button.
* Take screenshots of the shared screen using **SCREENSHOT**.
* 
* Save screenshots and notes using **SAVE**.

### **Server (`server.js`)**

* Serves static files (`presenter.html`, `participant.html`, CSS/JS) using Express.
* Uses Socket.io to handle real-time communication:

  * `offer` / `answer` – WebRTC SDP negotiation.
  * `icecandidate` – network candidates for peer connections.
  * `submit-question` / `receive-question` – real-time Q&A messaging between presenter and participants.

---

## **Project Structure**

```
├─ public/
│   ├─ presenter.html      # Presenter interface
│   ├─ participant.html    # Participant interface
│   ├─ presenter.js        # Presenter-side JS logic
│   ├─ participant.js      # Participant-side JS logic
│   ├─ styles/             # CSS files
└─ server.js               # Node.js server with Socket.io
```

---

## **Future Improvements**

* Add real-time whiteboard and drawing tools.
* Support multiple presenters and breakout rooms.
* Integrate chat history and question timestamps.
* Add audio streaming alongside screen sharing.

---

## **Contributors**

*  Sean Walker – Project Leader; oversaw project workflow, coordinated team tasks, Backend development, real-time Q&A system, and HTML for question display.
  
* David Larsen – Backend development, screen sharing, download and note-taking functionality; contributed to CSS/HTML for all pages and frontend features.

* Francis James – Designed UI, CSS, and HTML.

* Sheldon Larsen – Assisted with troubleshooting questions and testing functionality.

