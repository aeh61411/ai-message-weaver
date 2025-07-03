// --- YOUR PUBLIC API KEY ---
const GEMINI_API_KEY = 'AIzaSyDZiFTW1Syc9UKzmoD9QtzMiF7VldtZ6VU';
// -------------------------

// --- Get all our HTML elements ---
const form = document.getElementById('ai-form');
const generateBtn = document.getElementById('generate-btn');
const resultText = document.getElementById('result-text');
const loading = document.getElementById('loading');
const detailsTextarea = document.getElementById('details');
const copyBtn = document.getElementById('copy-btn');
const resultContainer = document.getElementById('result-container');


// --- COPY BUTTON LOGIC ---
copyBtn.addEventListener('click', () => {
    // Check if there is text to copy
    if (resultText.textContent.trim() === '') {
        alert('Nothing to copy yet! Please generate a message first.');
        return;
    }

    // Use the modern Navigator Clipboard API
    navigator.clipboard.writeText(resultText.textContent)
        .then(() => {
            // Success! Give user feedback.
            const originalText = copyBtn.querySelector('span').textContent;
            copyBtn.querySelector('span').textContent = 'Copied!';
            copyBtn.classList.add('copied');

            // Revert back after 2 seconds
            setTimeout(() => {
                copyBtn.querySelector('span').textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Sorry, could not copy text. Please try again.');
        });
});


// --- FORM SUBMISSION LOGIC ---
form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    // --- Validation Check ---
    if (detailsTextarea.value.trim() === '') {
        detailsTextarea.classList.add('input-error');
        alert('Please provide some key details for the AI.');
        setTimeout(() => detailsTextarea.classList.remove('input-error'), 600);
        return; 
    }

    // --- Start generation process ---
    loading.classList.remove('hidden');
    resultText.textContent = '';
    resultContainer.style.display = 'block'; // Make sure the result box is visible
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    const messageType = document.getElementById('message-type').value;
    const details = detailsTextarea.value;
    const tone = document.getElementById('tone').value;

    const prompt = `
        You are an expert message writer. Your task is to write a message based on the user's request.
        Message Type: "${messageType}"
        Tone: "${tone}"
        Key Details: "${details}"
        Please write the complete message now. Do not add any extra comments or introductions. Just provide the message text itself.
    `;

    const model = 'gemini-1.5-flash-latest';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message);
        }

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        resultText.textContent = aiResponse.trim();

    } catch (error) {
        console.error('Error:', error);
        resultText.textContent = `[An error occurred]: ${error.message}`;
    } finally {
        loading.classList.add('hidden');
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Message';
    }
});