
// Function to populate language options
function populateLanguages() {
    const select = document.getElementById('language');
    const voices = speechSynthesis.getVoices();

    // Clear existing options
    select.innerHTML = '';

    // Populate dropdown with available voices and languages
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        select.appendChild(option);
    });

    // Set a default option if available
    if (voices.length > 0) {
        select.value = voices[0].name;
    }
}

// Function to speak the text
function speakText() {
    const textArea = document.getElementById('text');
    const text = textArea.value;
    const selectedVoiceName = document.getElementById('language').value;

    if (text.trim() === '') {
        alert('Please enter some text.');
        return;
    }

    // Get available voices and select the chosen one
    const voices = speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoiceName);

    if (voice) {
        utterance.voice = voice;
    }

    speechSynthesis.speak(utterance);
}

// Function to update word count and enforce word limit
function enforceWordLimit() {
    const textArea = document.getElementById('text');
    const text = textArea.value;

    // Split text by whitespace and count words
    const words = text.trim().split(/\s+/).filter(Boolean);

    if (words.length > 200) {
        // Limit to the first 200 words
        textArea.value = words.slice(0, 200).join(' ');
        alert('Word limit of 200 exceeded. Text has been truncated.');
    }
}

// Event listener for the "Speak" button
document.getElementById('btn').addEventListener('click', speakText);

// Event listener for input to enforce word limit
document.getElementById('text').addEventListener('input', enforceWordLimit);

// Event listener for pressing Enter to submit
document.getElementById('text').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of adding a new line
        speakText(); // Call the speakText function
    }
});

// Populate languages when voices are loaded
function onVoicesChanged() {
    populateLanguages();
}

// Event listener for voiceschanged event
speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

// Initial call to populate languages when the page loads
window.addEventListener('load', onVoicesChanged);
