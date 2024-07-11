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

document.addEventListener('DOMContentLoaded', async () => {
    const capturedPhoto = document.getElementById('capturedPhoto');
    const swapButton = document.getElementById('swap');
    const imageOptions = document.getElementById('imageOptions');
    const dataUrl = localStorage.getItem('capturedImage');
    let selectedTargetImage = null;

    capturedPhoto.src = dataUrl;

    try {
        const storageRef = storage.ref().child('upload_images');
        const listResult = await storageRef.listAll();
        const targetImages = await Promise.all(listResult.items.map(async itemRef => {
            const url = await itemRef.getDownloadURL();
            return url;
        }));

        targetImages.forEach(src => {
            const div = document.createElement('div');
            div.classList.add('image-option');
            const img = document.createElement('img');
            img.src = src;
            img.classList.add('target-image');
            img.dataset.src = src;
            div.appendChild(img);
            imageOptions.appendChild(div);

            img.addEventListener('click', () => {
                document.querySelectorAll('.target-image').forEach(image => image.classList.remove('selected'));
                img.classList.add('selected');
                selectedTargetImage = img.dataset.src;
            });
        });

        if (targetImages.length > 0) {
            selectedTargetImage = targetImages[0];
        }
    } catch (error) {
        console.error('Error fetching target images:', error);
    }

    swapButton.addEventListener('click', async () => {
        swapButton.classList.add('clicked'); // Add the 'clicked' class when the button is clicked
        try {
            const sourceImg = dataUrl.split(',')[1];
            const response = await fetch(selectedTargetImage);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = async () => {
                const targetImg = reader.result.split(',')[1]; // Get base64 data from the selected image

                const response = await fetch('/faceswap', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sourceImg, targetImg }) // Update payload to include base64 data
                });

                if (!response.ok) {
                    throw new Error('Failed to swap faces');
                }

                const data = await response.json();
                if (data.image) {
                    console.log('Face swap successful'); // Log a concise message
                    localStorage.setItem('swappedImage', `data:image/jpeg;base64,${data.image}`);
                    window.location.href = 'result.html';
                } else {
                    throw new Error('Invalid response data');
                }
            };

            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Error swapping faces:', error.message); // Log only the error message
            alert('Error swapping faces: ' + error.message);
        }
    });

    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html'; // Navigate back to the index page
        });
    }
});
