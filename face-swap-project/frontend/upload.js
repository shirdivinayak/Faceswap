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

const fileInput = document.getElementById('fileInput');
const saveImagesButton = document.getElementById('saveImages');
const backToCaptureButton = document.getElementById('backToCapture');

saveImagesButton.addEventListener('click', async () => {
    const files = fileInput.files;
    const folderName = 'upload_images'; // Use a fixed folder name
    const storageRef = storage.ref().child(folderName);

    try {
        // List all files in the folder
        const listResult = await storageRef.listAll();
        
        // Delete each file
        await Promise.all(listResult.items.map(itemRef => itemRef.delete()));

        console.log('All existing images deleted successfully.');
    } catch (error) {
        console.error('Error deleting existing images:', error);
        alert('Error deleting existing images');
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uniqueFileName = `${folderName}/uploaded_image_${Date.now()}_${i}.jpg`; // Use timestamp and index for unique filename
        const imageRef = storage.ref().child(uniqueFileName);

        try {
            await imageRef.put(file);
            const downloadURL = await imageRef.getDownloadURL();
            console.log(`Image uploaded successfully:`);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        }
    }
    alert('Images saved and uploaded successfully!');
});

backToCaptureButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.getElementById("fileInput").addEventListener("change", function(event) {
    const fileList = event.target.files;
    const imageDetails = document.getElementById("imageDetails");
    imageDetails.innerHTML = "";
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const fileName = file.name;
        const listItem = document.createElement("p");
        listItem.textContent = `Name: ${fileName}`;
        imageDetails.appendChild(listItem);
    }
});
