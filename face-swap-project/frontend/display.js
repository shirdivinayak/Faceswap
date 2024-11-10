// display.js

document.addEventListener('DOMContentLoaded', () => {
    const capturedPhoto = document.getElementById('capturedPhoto');
    const swapButton = document.getElementById('swap');
    const targetImages = document.querySelectorAll('.target-image');
    const buttons = document.querySelectorAll('button');

    let selectedTargetImage = '/assets/superman.jpeg'; // Default target image

    const dataUrl = localStorage.getItem('capturedImage');
    capturedPhoto.src = dataUrl;

    targetImages.forEach(img => {
        img.addEventListener('click', () => {
            targetImages.forEach(image => image.classList.remove('selected'));
            img.classList.add('selected');
            selectedTargetImage = img.getAttribute('data-src');
        });
    });

    swapButton.addEventListener('click', async () => {
        try {
            const sourceImg = dataUrl.split(',')[1];

            const response = await fetch('/faceswap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sourceImg, targetImg: selectedTargetImage })
            });

            if (!response.ok) {
                throw new Error('Failed to swap faces');
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (data.image) {
                localStorage.setItem('swappedImage', `data:image/jpeg;base64,${data.image}`);
                window.location.href = 'result.html';
            } else {
                throw new Error('Invalid response data');
            }
        } catch (error) {
            console.error('Error swapping faces:', error);
            alert('An error occurred while swapping faces. Please try again.');
        }
    });

    // Add event listeners to change button color on click
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });
});
