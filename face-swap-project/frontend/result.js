// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6X-mCAe2wi2-JzaBcrNMm8ifXsImQhW4s",
    authDomain: "faceswap-d6776.firebaseapp.com",
    projectId: "faceswap-d6776",
    storageBucket: "faceswap-d6776.appspot.com",
    messagingSenderId: "53495876308",
    appId: "1:53495876308:web:6bd6f2d807a8145b698941"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

document.addEventListener('DOMContentLoaded', () => {
    const resultImg = document.getElementById('result');
    const swappedImage = localStorage.getItem('swappedImage');
    if (swappedImage) {
        resultImg.src = swappedImage;
    }

    const saveButton = document.getElementById('saveBtn');
    const backButton = document.getElementById('backButton');

    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html'; // Navigate back to the index page
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            try {
                // Convert image source to blob
                const response = await fetch(resultImg.src);
                const blob = await response.blob();

                // Optional: Increase the quality if the blob comes from a canvas
                // Assuming you have a canvas context available
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.src = resultImg.src;
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob(async (blob) => {
                        // Generate a unique file name
                        const uniqueFileName = `face_swap_result_${Date.now()}.jpg`;

                        // Upload blob to Firebase Storage
                        const storageRef = storage.ref();
                        const imageRef = storageRef.child(`images/${uniqueFileName}`);
                        await imageRef.put(blob);

                        // Get the download URL
                        const downloadURL = await imageRef.getDownloadURL();

                        console.log('Image uploaded successfully:');
                        alert('Image has been successfully saved!'); // Display pop-up message

                        // Change button color to green
                        saveButton.classList.add('clicked');
                    }, 'image/jpeg', 1.0); // Adjust quality here
                };
            } catch (error) {
                console.error('Error uploading the image:', error);
            }
        });
    }
});
