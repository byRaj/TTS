
// Function to populate language options
function populateLanguages() {
    const select = document.getElementById('language');

    // List of voices including Hindi (example list, may need adjustment based on available voices)
    const voices = [
        { name: 'US English Female', lang: 'US English Female' },
        { name: 'US English Male', lang: 'US English Male' },
        { name: 'UK English Female', lang: 'UK English Female' },
        { name: 'UK English Male', lang: 'UK English Male' },
        { name: 'Spanish Female', lang: 'Spanish Female' },
        { name: 'French Female', lang: 'French Female' },
        { name: 'German Female', lang: 'German Female' },
        { name: 'Hindi Female', lang: 'Hindi Female' }, // Hindi language option
        { name: 'Hindi Male', lang: 'Hindi Male' },     // Hindi language option
        // Add more voices if needed
    ];

    // Clear existing options
    select.innerHTML = '';

    // Populate dropdown with available voices and languages
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.lang;
        option.textContent = `${voice.name} (${voice.lang})`;
        select.appendChild(option);
    });

    // Set a default option if available
    if (voices.length > 0) {
        select.value = voices[0].lang;
    }
}

// Function to speak the text
function speakText() {
    const textArea = document.getElementById('text');
    const text = textArea.value;
    const selectedVoiceLang = document.getElementById('language').value;

    if (text.trim() === '') {
        alert('Please enter some text.');
        return;
    }

    // Use ResponsiveVoice to speak the text
    responsiveVoice.speak(text, selectedVoiceLang);
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

// Initial call to populate languages when the page loads
window.addEventListener('load', populateLanguages);
