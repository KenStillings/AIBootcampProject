// API Base URL
const API_BASE_URL = window.location.origin;

// DOM Elements
const checkHealthBtn = document.getElementById('checkHealth');
const healthResult = document.getElementById('healthResult');
const fetchDataBtn = document.getElementById('fetchData');
const dataResult = document.getElementById('dataResult');
const sendMessageBtn = document.getElementById('sendMessage');
const messageInput = document.getElementById('messageInput');
const echoResult = document.getElementById('echoResult');

// Helper function to display results
function displayResult(element, data, isError = false) {
    element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    element.classList.remove('success', 'error');
    element.classList.add(isError ? 'error' : 'success');
}

// Check server health
checkHealthBtn.addEventListener('click', async () => {
    try {
        healthResult.innerHTML = '<p>Loading...</p>';
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        displayResult(healthResult, data);
    } catch (error) {
        displayResult(healthResult, { error: error.message }, true);
    }
});

// Fetch data from API
fetchDataBtn.addEventListener('click', async () => {
    try {
        dataResult.innerHTML = '<p>Loading...</p>';
        const response = await fetch(`${API_BASE_URL}/api/data`);
        const data = await response.json();
        displayResult(dataResult, data);
    } catch (error) {
        displayResult(dataResult, { error: error.message }, true);
    }
});

// Send message to backend
sendMessageBtn.addEventListener('click', async () => {
    const message = messageInput.value.trim();
    
    if (!message) {
        displayResult(echoResult, { error: 'Please enter a message!' }, true);
        return;
    }

    try {
        echoResult.innerHTML = '<p>Sending...</p>';
        const response = await fetch(`${API_BASE_URL}/api/echo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        displayResult(echoResult, data);
        messageInput.value = '';
    } catch (error) {
        displayResult(echoResult, { error: error.message }, true);
    }
});

// Add Enter key support for message input
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessageBtn.click();
    }
});

// Initial page load message
console.log('Frontend loaded successfully! 🚀');
