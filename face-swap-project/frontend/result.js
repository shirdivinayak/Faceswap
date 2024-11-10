document.addEventListener('DOMContentLoaded', () => {
    const resultImg = document.getElementById('result');
    const swappedImage = localStorage.getItem('swappedImage');
    resultImg.src = swappedImage;
});
