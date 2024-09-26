
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    // Function to populate language options
    function populateLanguages() {
        const select = document.getElementById('language');
        if (!select) {
            console.error("Language select element not found");
            return;
        }

        // List of voices including Hindi (example list, may need adjustment based on available voices)
        const voices = [
            { name: 'US English Female', lang: 'US English Female' },
            { name: 'US English Male', lang: 'US English Male' },
            { name: 'UK English Female', lang: 'UK English Female' },
            { name: 'UK English Male', lang: 'UK English Male' },
            { name: 'Spanish Female', lang: 'Spanish Female' },
            { name: 'French Female', lang: 'French Female' },
            { name: 'Hindi Female', lang: 'Hindi Female' }, // Hindi language option
            /*{ name: 'Hindi Male', lang: 'Hindi Male' }, */    // Hindi language option
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
        const textContainer = document.getElementById('text-container');
        if (!textContainer) {
            console.error("Text container element not found");
            return;
        }
        const text = textContainer.innerText;
        const selectedVoiceLang = document.getElementById('language').value;

        if (text.trim() === '') {
            alert('Please enter some text.');
            return;
        }

        // Use ResponsiveVoice to speak the text
        responsiveVoice.speak(text, selectedVoiceLang, {
            onstart: () => {
                highlightText(text);
            },
            onend: () => {
                clearHighlight();
            },
        });
    }

    // Function to highlight the text as it is spoken
    /* function highlightText(text) {
         const textContainer = document.getElementById('text-container');
         if (!textContainer) {
             console.error("Text container element not found");
             return;
         }
 
         const words = text.split(' ');
         textContainer.innerHTML = ''; // Clear existing content
 
         words.forEach((word, index) => {
             const span = document.createElement('span');
             span.textContent = word + ' ';
             span.id = `word-${index}`;
             textContainer.appendChild(span);
         });
 
         let wordIndex = 0;
         const interval = setInterval(() => {
             if (wordIndex < words.length) {
                 const currentWord = document.getElementById(`word-${wordIndex}`);
                 if (currentWord) {
                     currentWord.classList.add('highlight');
                 }
 
                 if (wordIndex > 0) {
                     const previousWord = document.getElementById(`word-${wordIndex - 1}`);
                     if (previousWord) {
                         previousWord.classList.remove('highlight');
                     }
                 }
                 wordIndex++;
             } else {
                 clearInterval(interval);
             }
         }, 400); // Adjust the timing as needed
     }
 
     // Function to clear the highlight after speaking
     function clearHighlight() {
         const textContainer = document.getElementById('text-container');
         if (!textContainer) {
             console.error("Text container element not found");
             return;
         }
         textContainer.innerHTML = textContainer.innerText; // Remove highlighting
     }*/

    // Function to update word count and enforce word limit
    function enforceWordLimit() {
        const textContainer = document.getElementById('text-container');
        if (!textContainer) {
            console.error("Text container element not found");
            return;
        }
        const text = textContainer.innerText;

        // Split text by whitespace and count words
        const words = text.trim().split(/\s+/).filter(Boolean);

        if (words.length > 500) {
            // Limit to the first 500 words
            textContainer.innerText = words.slice(0, 500).join(' ');
            alert('Word limit of 500 exceeded. Text has been truncated.');
        }
    }

    // Function to read the PDF file and extract text using PDF.js
    function readPDF(file) {
        const reader = new FileReader();

        reader.onload = function () {
            const typedArray = new Uint8Array(reader.result);
            pdfjsLib.getDocument(typedArray).promise.then(function (pdf) {
                let extractedText = '';

                const totalPages = pdf.numPages;
                const pagePromises = [];

                // Process each page of the PDF
                for (let i = 1; i <= totalPages; i++) {
                    const pagePromise = pdf.getPage(i).then(function (page) {
                        return page.getTextContent().then(function (textContent) {
                            const pageText = textContent.items.map(item => item.str).join(' ');
                            extractedText += pageText + ' ';
                        });
                    });
                    pagePromises.push(pagePromise);
                }

                // When all pages are processed
                Promise.all(pagePromises).then(function () {
                    const textContainer = document.getElementById('text-container');
                    textContainer.innerText = extractedText.trim();
                    enforceWordLimit();  // Apply the word limit
                });
            });
        };

        reader.readAsArrayBuffer(file);
    }

    // Event listener for the "Speak" button
    const speakButton = document.getElementById('btn');
    if (!speakButton) {
        console.error("Speak button element not found");
    } else {
        speakButton.addEventListener('click', speakText);
    }

    // Event listener for input to enforce word limit
    const textContainer = document.getElementById('text-container');
    if (!textContainer) {
        console.error("Text container element not found");
    } else {
        textContainer.addEventListener('input', enforceWordLimit);
    }

    // Event listener for file input (PDF upload)
    const fileInput = document.getElementById('File');
    if (!fileInput) {
        console.error("File input element not found");
    } else {
        fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file && file.type === 'application/pdf') {
                readPDF(file);
            } else {
                alert('Please upload a valid PDF file.');
            }
        });
    }

    // Initial call to populate languages when the page loads
    populateLanguages();
});
