const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const videoPlayer = document.getElementById('videoPlayer');
const savedVideosLinksContainer = document.getElementById('savedVideosLinksContainer');
const filterSelect = document.getElementById('filterSelect'); // Filter dropdown
const shareScreenBtn = document.getElementById('shareScreenBtn');
const startMeetingBtn = document.getElementById('startMeetingBtn');

let mediaRecorder;
let recordedChunks = [];
let screenStream;
let peerConnection;
let localStream;
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

// Start Recording and Self-View
recordBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoPlayer.srcObject = stream;
        videoPlayer.muted = true;  // Mute self in the preview

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            saveVideo(blob);  // Save and display video link
            recordedChunks = [];
        };

        recordBtn.disabled = true;
        stopBtn.disabled = false;

    } catch (err) {
        console.error('Error accessing video/audio:', err);
    }
});

// Stop Recording
stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();  // Stops both the video preview and the recording
    stopBtn.disabled = true;
    recordBtn.disabled = false;
});

// Save Video
function saveVideo(blob) {
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();

    const videoLink = document.createElement('div');
    videoLink.innerHTML = `
        <a href="${url}" target="_blank">Video saved at ${time} on ${date}</a>
        <button class="delete-btn">Delete</button>
    `;
    videoLink.classList.add('video-link');

    savedVideosLinksContainer.appendChild(videoLink);

    videoLink.querySelector('.delete-btn').addEventListener('click', () => {
        URL.revokeObjectURL(url);
        videoLink.remove();
    });
}

// Share Screen
shareScreenBtn.addEventListener('click', async () => {
    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        videoPlayer.srcObject = screenStream;
        videoPlayer.muted = true;  // Mute self in the preview

        mediaRecorder = new MediaRecorder(screenStream);
        mediaRecorder.start();

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            saveVideo(blob);  // Save and display video link
            recordedChunks = [];
        };

        shareScreenBtn.disabled = true;
        stopBtn.disabled = false;

    } catch (err) {
        console.error('Error accessing screen sharing:', err);
    }
});

// Start Meeting (WebRTC)
startMeetingBtn.addEventListener('click', async () => {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoPlayer.srcObject = localStream;

        peerConnection = new RTCPeerConnection(configuration);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        console.log('Offer created:', offer);

        startMeetingBtn.disabled = true;

    } catch (err) {
        console.error('Error starting meeting:', err);
    }
});

// Signaling logic (Placeholder: You need a signaling server for this to work)
function handleRemoteOffer(offer) {
    peerConnection.setRemoteDescription(offer);
    // Other WebRTC connection logic would go here
}

// Automatically save video on tab close or page refresh
window.addEventListener('beforeunload', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
});
