import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './index.css';
import './App.css';

// Check if API key is available
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
if (!API_KEY) {
  console.error('API key not found. Please check your .env file');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input;
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prevMessages) => [...prevMessages, { text: userMessage, sender: 'user', time: timestamp }]);
      setInput('');
      setIsTyping(true);

      try {
        const result = await model.generateContent(userMessage);
        const botResponse = formatBotResponse(result.response.text(), userMessage);
        
        // Simulate typing effect
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: botResponse, sender: 'bot', time: timestamp },
          ]);
          setIsTyping(false);
        }, 500);
      } catch (error) {
        console.error('Error generating response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong. Please try again.', sender: 'bot', time: timestamp },
        ]);
        setIsTyping(false);
      }
    }
  };

  const formatBotResponse = (response) => {
    const formattedResponse = response.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
    return formattedResponse.trim();
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen background-animate">
      <div className="animated-background"></div>
      <div className="relative w-full max-w-4xl h-[80vh] bg-gray-900/70 rounded-2xl shadow-2xl backdrop-blur-xl backdrop-filter overflow-hidden border border-gray-700/50 z-10">
        {/* Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <h2 className="text-center text-white text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Assistant
          </h2>
        </div>

        {/* Messages Container */}
        <div className="messages flex-grow h-[calc(80vh-8rem)] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-white'
                }`}
              >
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium opacity-75">
                    {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  <span className="text-xs opacity-50 ml-2">{msg.time}</span>
                </div>
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center text-gray-400 text-sm ml-4">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              AI is typing...
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              disabled={isTyping}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
