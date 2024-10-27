import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Added import for GoogleGenerativeAI
import './index.css';
import './App.css';

const genAI = new GoogleGenerativeAI('AIzaSyAm6nERIrTRqcMat7sJKGKByGqUG3FW94w'); // Replace with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Get generative model

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null); // Create a ref for the end of messages

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
        console.error('Error generating response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong. Please try again.', sender: 'bot' },
        ]);
      }
    }
  };

  // Scroll to the bottom of the messages when they change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-center text-white text-xl mb-4">What can I help with?</h2>
        <div className="messages max-h-72 overflow-y-auto mb-4 p-3 border border-gray-700 rounded-lg bg-gray-700">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`px-4 py-2 rounded-lg shadow ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} /> {/* Reference for scrolling */}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="w-full px-4 py-2 mb-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="w-full px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
