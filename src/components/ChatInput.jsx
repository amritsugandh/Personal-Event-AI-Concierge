import { useState, useEffect } from 'react';
import { Send, User, Mic, MicOff } from 'lucide-react';
import { sanitizeInput } from '../utils/aiAgent.js';

const ChatInput = ({ onSendMessage }) => {
  const [inputBox, setInputBox] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Setup Web Speech API for V2 Voice
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputBox(transcript);
        setIsListening(false);
        // Automatically send the voice input!
        const cleanStr = sanitizeInput(transcript);
        if (cleanStr) {
          onSendMessage(cleanStr);
          setInputBox(''); // Reset after sending
        }
      };

      recog.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, [onSendMessage]);

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      if (recognition) {
        recognition.start();
        setIsListening(true);
      } else {
        alert("Your browser does not support Voice Recognition.");
      }
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const cleanStr = sanitizeInput(inputBox);
    if (!cleanStr) return;
    onSendMessage(cleanStr);
    setInputBox('');
  };

  return (
    <form className="flex w-full items-center space-x-3 bg-slate-900/60 p-3 rounded-2xl border border-cyan-500/30 backdrop-blur-xl shadow-2xl focus-within:border-cyan-400/80 focus-within:shadow-glow-cyan transition-all duration-300" onSubmit={handleSend}>
      <div className="bg-cyan-500/10 border border-cyan-500/20 p-2.5 rounded-xl hidden sm:block">
        <User className="h-5 w-5 text-cyan-400" />
      </div>
      
      <button 
        type="button"
        onClick={toggleListen}
        className={`p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center ${isListening ? 'bg-red-500 text-white animate-pulse shadow-glow-cyan' : 'bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-cyan-400'}`}
        title="Voice Input"
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>

      <input
        type="text"
        className="flex-1 bg-transparent border-none text-slate-100 outline-none placeholder:text-slate-500 font-medium tracking-wide focus:ring-0 px-2"
        placeholder={isListening ? "Listening... Speak now!" : "Enter your interests, or ask about a session..."}
        value={inputBox}
        onChange={(e) => setInputBox(e.target.value)}
      />
      <button
        type="submit"
        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 disabled:border disabled:border-slate-700 flex items-center justify-center cursor-pointer shadow-md"
        disabled={!inputBox.trim() && !isListening}
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
};

export default ChatInput;
