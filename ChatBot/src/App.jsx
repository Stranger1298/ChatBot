import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Added import for GoogleGenerativeAI

const genAI = new GoogleGenerativeAI('AIzaSyAm6nERIrTRqcMat7sJKGKByGqUG3FW94w'); // Initialize GoogleGenerativeAI
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Get generative model

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      // Update messages with user input
      setMessages((prevMessages) => [...prevMessages, { text: input, sender: 'user' }]);
      const userMessage = input;
      setInput(''); // Clear input field

      try {
        // Generate response using GoogleGenerativeAI
        const result = await model.generateContent(userMessage); // Generate content
        const botResponse = result.response.text(); // Get the response text

        // Update messages with bot response
        setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: 'bot' }]);
      } catch (error) {
        // Enhanced error logging
        console.error('Error generating response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong. Please try again.', sender: 'bot' },
        ]);
      }
    }
  };

  return (
    <div className="chat-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#e9ecef' }}>
      <div style={{ border: '2px solid #007bff', borderRadius: '10px', padding: '20px', width: '400px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', backgroundColor: '#ffffff' }}>
        <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '20px' }}>Chatbot</h2>
        <div className="messages" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px', padding: '10px', border: '1px solid #ced4da', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', marginBottom: '10px' }}>
              <div style={{
                display: 'inline-block',
                padding: '10px 15px',
                borderRadius: '20px',
                margin: '5px',
                backgroundColor: msg.sender === 'user' ? '#007bff' : '#e2e3e5',
                color: msg.sender === 'user' ? '#fff' : '#000',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                maxWidth: '80%', // Limit the width of the message bubbles
                wordWrap: 'break-word' // Ensure long words break to the next line
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()} // Changed onKeyPress to onKeyDown
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da', marginBottom: '10px', fontSize: '16px' }}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: '#fff', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
