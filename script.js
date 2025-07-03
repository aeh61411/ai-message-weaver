const GEMINI_API_KEY = 'AIzaSyDZiFTW1Syc9UKzmoD9QtzMiF7VldtZ6VU';

const form = document.getElementById('ai-form');
const generateBtn = document.getElementById('generate-btn');
const resultText = document.getElementById('result-text');
const loading = document.getElementById('loading');
const detailsTextarea = document.getElementById('details');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    if (detailsTextarea.value.trim() === '') {
        detailsTextarea.classList.add('input-error');

        alert('Please provide some key datapoints for the AI mission.');

        setTimeout(() => {
            detailsTextarea.classList.remove('input-error');
        }, 600);

        return; 
    }


    loading.classList.remove('hidden');
    resultText.textContent = '';
    generateBtn.disabled = true;
    generateBtn.textContent = 'TRANSMITTING...';

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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
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
        resultText.textContent = `[CONNECTION FAILED] :: ERROR :: ${error.message}`;
    } finally {
        loading.classList.add('hidden');
        generateBtn.disabled = false;
        generateBtn.textContent = 'ENGAGE AI';
    }
});