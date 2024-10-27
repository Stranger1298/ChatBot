import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai"; // Added import for GoogleGenerativeAI
import './index.css';
import './App.css';

const genAI = new GoogleGenerativeAI('AIzaSyAm6nERIrTRqcMat7sJKGKByGqUG3FW94w'); // Replace with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Get generative model

function App() {
  const [messages, setMessages] = useState([]); // State to hold messages
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null); // Create a ref for the end of messages

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input; // Store user message
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get current time in HH:MM format
      setMessages((prevMessages) => [...prevMessages, { text: userMessage, sender: 'user', time: timestamp }]); // Update messages with user input
      setInput(''); // Clear input field

      try {
        // Generate response using GoogleGenerativeAI
        const result = await model.generateContent(userMessage); // Generate content
        const botResponse = formatBotResponse(result.response.text(), userMessage); // Format the response

        // Update messages with bot response
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponse, sender: 'bot', time: timestamp },
        ]);
      } catch (error) {
        console.error('Error generating response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong. Please try again.', sender: 'bot', time: timestamp },
        ]);
      }
    }
  };

  // Function to format the bot's response and make text bold where asterisks are present
  const formatBotResponse = (response, userMessage) => {
    // Replace asterisks with <strong> tags for bold text
    const formattedResponse = response.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    return `
      Hi there! You asked: "${userMessage}"
      Here’s what I found:
      ${formattedResponse}
    `.trim(); // Trim to remove extra whitespace
  };

  // Scroll to the bottom of the messages when they change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-r from-purple-500 to-blue-500"> {/* Gradient background */}
      <div className="w-full max-w-md h-full bg-gray-800 rounded-lg shadow-2xl p-6 flex flex-col"> {/* Shadow for depth */}
        <h2 className="text-center text-white text-2xl mb-4">What can I help with Today?</h2>
        <div className="messages flex-grow overflow-y-auto mb-4 p-3 border border-gray-700 rounded-lg bg-gradient-to-b from-gray-700 to-gray-800"> {/* Gradient background for messages */}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`px-4 py-2 rounded-lg shadow ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{msg.sender === 'user' ? 'Me' : 'Chatbot'}</span>
                  <span className="text-xs text-gray-300">{msg.time}</span> {/* Timestamp */}
                </div>
                <span className="ml-2 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: msg.text }} /> {/* Render HTML for bold text */}
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
          className="w-full px-4 py-2 mb-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" // Focus ring for input
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
