// script.jsconst userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const textDisplay = document.getElementById('text-display');

// Load existing text from file
fetch('text.txt')
  .then(response => response.text())
  .then(text => {
    const textLines = text.split('\n');
    textLines.forEach(line => {
      const newText = document.createElement('p');
      newText.textContent = line;
      textDisplay.appendChild(newText);
    });
  });

submitBtn.addEventListener('click', () => {
  const text = userInput.value.trim();
  if (text !== '') {
    // Append new text to file
    fetch('https://api.github.com/repos/your-username/your-repo-name/contents/text.txt', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer YOUR_GITHUB_TOKEN',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'message': 'Update text.txt',
        'content': btoa(text + '\n' + textDisplay.textContent)
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Update text display
      const newText = document.createElement('p');
      newText.textContent = text;
      textDisplay.appendChild(newText);
      userInput.value = '';
    })
    .catch(error => console.error(error));
  }
});
