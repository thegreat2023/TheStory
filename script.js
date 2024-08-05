// script.js
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const textDisplay = document.getElementById('text-display');

submitBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if (text !== '') {
        const newText = document.createElement('p');
        newText.textContent = text;
        textDisplay.appendChild(newText);
        userInput.value = '';
    }
});
