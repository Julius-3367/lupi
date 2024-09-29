const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const videoPlayer = document.getElementById('videoPlayer');

let mediaRecorder;
let recordedChunks = [];

// Start Recording
recordBtn.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoPlayer.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        videoPlayer.srcObject = null;
        videoPlayer.src = URL.createObjectURL(blob);
        videoPlayer.controls = true;
        saveBtn.disabled = false;
        deleteBtn.disabled = false;
    };

    recordBtn.disabled = true;
    stopBtn.disabled = false;
    saveBtn.disabled = true;
    deleteBtn.disabled = true;
});

// Stop Recording
stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    stopBtn.disabled = true;
    recordBtn.disabled = false;
});

// Save Video (Dummy function for now)
saveBtn.addEventListener('click', () => {
    alert('Video saved!');
});

// Delete Video
deleteBtn.addEventListener('click', () => {
    videoPlayer.src = '';
    recordedChunks = [];
    saveBtn.disabled = true;
    deleteBtn.disabled = true;
});

// Start Meeting (Dummy function for now)
document.getElementById('startMeetingBtn').addEventListener('click', () => {
    alert('Meeting started!');
});

// Share Screen (Dummy function for now)
document.getElementById('shareScreenBtn').addEventListener('click', () => {
    alert('Screen sharing started!');
});
