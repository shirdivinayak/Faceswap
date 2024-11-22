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
    const imagesContainer = document.getElementById('imagesContainer');
    const deleteAllBtn = document.getElementById('deleteAllBtn');

    const loadImages = async () => {
        imagesContainer.innerHTML = ''; // Clear the container before loading images

        try {
            // Reference to the images folder
            const storageRef = storage.ref().child('images');
            const listResult = await storageRef.listAll();

            // Reverse the order of items for LIFO display
            const items = listResult.items.reverse();

            // Iterate through each item in the folder and get the download URL
            for (const itemRef of items) {
                const downloadURL = await itemRef.getDownloadURL();
                displayImage(downloadURL, itemRef);
            }
        } catch (error) {
            console.error('Error listing images:', error);
        }
    };

    deleteAllBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete all images?')) {
            try {
                // Reference to the images folder
                const storageRef = storage.ref().child('images');
                const listResult = await storageRef.listAll();

                for (const itemRef of listResult.items) {
                    await itemRef.delete();
                }
                imagesContainer.innerHTML = '';
                alert('All images have been deleted.');
            } catch (error) {
                console.error('Error deleting images:', error);
            }
        }
    });

    const displayImage = (url, itemRef) => {
        const imgElement = document.createElement('img');
        imgElement.src = url;
        imgElement.className = 'uploaded-image';
        imgElement.addEventListener('click', () => {
            createAndDownloadCanvasImage(url, itemRef.name); // Download image on click
        });
        imagesContainer.appendChild(imgElement);
    };

    const createAndDownloadCanvasImage = (url, filename) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // This is important for CORS

        img.onload = () => {
            const scaleFactor = 2; // Increase scale factor for higher resolution
            canvas.width = img.width * scaleFactor;
            canvas.height = img.height * scaleFactor;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Adjust the quality here
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg', 1.0); // 1.0 indicates the highest quality
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        img.src = url;
    };

    // Load images initially
    loadImages();
});
