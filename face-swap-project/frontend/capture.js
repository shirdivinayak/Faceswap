const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const uploadPageButton = document.getElementById('uploadPage');

// Access the webcam
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Error accessing camera: ", err);
        });
}

// Start the camera when the page loads
window.addEventListener('load', startCamera);

captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');

    // Preserve the aspect ratio
    const aspectRatio = video.videoWidth / video.videoHeight;
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    context.drawImage(video, 0, 0, width, height);

    // Convert canvas to data URL and store in localStorage
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0); // Highest quality
    console.log('Captured Data URL:', dataUrl); // Debug statement

    try {
        localStorage.setItem('capturedImage', dataUrl);
        console.log('Image saved to localStorage'); // Debug statement
        // Redirect to display page
        window.location.href = 'display.html';
    } catch (e) {
        console.error('Error saving image to localStorage', e);
        alert('Unable to save image. Please ensure your browser supports localStorage and has enough space.');
    }
});

uploadPageButton.addEventListener('click', () => {
    window.location.href = 'upload.html';
});
