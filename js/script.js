document.addEventListener('DOMContentLoaded', function () {
    const chatbotContainer = document.getElementById('chatbot-container');

    // Create Chatbot Interface
    chatbotContainer.innerHTML = `
        <div style="text-align: left; margin-bottom: 10px;">
            <input id="user-input" type="text" placeholder="Ask me about Sujal Arya..." style="width: 80%; padding: 10px;"/>
            <button id="send-btn" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;">Send</button>
        </div>
        <div id="chat-output" style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; max-height: 300px; overflow-y: auto;"></div>
    `;

    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const chatOutput = document.getElementById('chat-output');

    let resumeText = '';

    // Function to load and extract text from the PDF
    async function loadPDF() {
        const pdfUrl = 'assets/Sujal_Resume_.pdf';  // Path to your resume PDF
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
        }

        resumeText = text;  // Store extracted text
    }

    // Call the loadPDF function on page load
    loadPDF();

    // Send button click handler
    sendButton.addEventListener('click', () => {
        const userMessage = userInput.value.trim();
        if (!userMessage) {
            chatOutput.innerHTML += `<p style="color: red;">Please type a question!</p>`;
            return;
        }

        chatOutput.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
        userInput.value = '';

        // Search for relevant information in resumeText
        const response = searchResume(userMessage);

        chatOutput.innerHTML += `<p><strong>Chatbot:</strong> ${response}</p>`;

        // Auto-scroll chat output
        chatOutput.scrollTop = chatOutput.scrollHeight;
    });

    // Simple function to search for keywords in resume text
    function searchResume(query) {
        if (!resumeText) {
            return "Sorry, I haven't loaded the resume yet. Please try again later.";
        }

        // Convert both query and resume text to lowercase for case-insensitive search
        const lowerQuery = query.toLowerCase();
        const lowerText = resumeText.toLowerCase();

        // Search for query in the resume text
        if (lowerText.includes(lowerQuery)) {
            return `I found some information about "${query}". Here's a snippet: \n...${resumeText.substring(lowerText.indexOf(lowerQuery), lowerText.indexOf(lowerQuery) + 300)}...`;
        } else {
            return "Sorry, I couldn't find any relevant information in my resume about that.";
        }
    }
});