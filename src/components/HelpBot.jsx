import { useState, useRef, useEffect } from 'react';
import { MessageCircleQuestion, X, Send, Bot } from 'lucide-react';

export default function HelpBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! Need help using the platform? Ask me anything!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputMessage('');

    // Simple FAQ logic
    setTimeout(() => {
      const lowerInput = userText.toLowerCase();
      let botResponse = "I'm not sure about that. Try asking about logging in, finding peers, or building an itinerary!";
      
      if (lowerInput.includes('login') || lowerInput.includes('sign') || lowerInput.includes('account') || lowerInput.includes('register')) {
        botResponse = "To login or register, click the 'Login / Signup' button at the top right of the navigation bar. You'll be able to create a free account to save your chat history!";
      } else if (lowerInput.includes('logout') || lowerInput.includes('log out') || lowerInput.includes('sign out')) {
        botResponse = "To log out, open the sidebar on the left (if you are on mobile, click the menu icon in the top left), and click the 'Secure Logout' button at the bottom.";
      } else if (lowerInput.includes('peer') || lowerInput.includes('network') || lowerInput.includes('match') || lowerInput.includes('friend') || lowerInput.includes('connect')) {
        botResponse = "To find peers, first tell the main AI Concierge (in the center of the screen) a bit about your background. Then, click the 'Find Peers' button at the top, or simply ask it directly!";
      } else if (lowerInput.includes('event') || lowerInput.includes('itinerary') || lowerInput.includes('schedule') || lowerInput.includes('matrix') || lowerInput.includes('recommendation')) {
        botResponse = "Your itinerary map will populate automatically when the AI recommends events based on your chat. You can also click any of the 'Featured Recommendations' to instantly add them to your map!";
      } else if (lowerInput.includes('history') || lowerInput.includes('erase') || lowerInput.includes('clear') || lowerInput.includes('delete') || lowerInput.includes('new chat')) {
        botResponse = "To start fresh, click the 'New Concierge Chat' button in your left sidebar. This will clear the main screen! Note: Past history remains saved in the cloud for your reference.";
      } else if (lowerInput.includes('profile') || lowerInput.includes('name') || lowerInput.includes('change')) {
        botResponse = "If you are logged in, your profile is managed by your secure credentials. You can view your profile summary in the top of the left sidebar!";
      } else if (lowerInput.includes('what is') || lowerInput.includes('platform') || lowerInput.includes('about')) {
        botResponse = "This is the TechConf Concierge! It uses AI to dynamically build your event schedule and match you with relevant attendees based on your technical background.";
      } else if (lowerInput.includes('voice') || lowerInput.includes('mic') || lowerInput.includes('speak') || lowerInput.includes('microphone')) {
        botResponse = "You can use voice commands by clicking the microphone icon inside the main chat input bar!";
      } else if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey') || lowerInput.includes('help')) {
        botResponse = "Hello! I can help you with things like how to login, how to find peers, navigating your itinerary, and using voice commands. What do you need help with?";
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-glow-cyan hover:scale-110 transition-transform flex items-center justify-center group"
          aria-label="Open Help Bot"
        >
          <MessageCircleQuestion className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] h-[450px] bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-cyan-900/40 border-b border-cyan-500/30 p-4 flex justify-between items-center relative overflow-hidden">
             {/* Glow blob */}
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none"></div>
             
             <div className="flex items-center relative z-10">
               <div className="p-2 border border-cyan-500/50 bg-cyan-950 rounded-xl mr-3 shadow-md">
                 <Bot className="w-5 h-5 text-cyan-400" />
               </div>
               <div>
                  <h3 className="font-bold text-white text-sm">Platform Support</h3>
                  <p className="text-[10px] text-cyan-300/80 font-bold tracking-widest uppercase">Online</p>
               </div>
             </div>
             
             <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors relative z-10 bg-slate-900/50 p-1.5 rounded-md border border-slate-700 hover:border-cyan-500/50">
               <X className="w-4 h-4" />
             </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-[#040914]/40">
             {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {msg.role === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center mr-2 mt-1 shrink-0 border border-cyan-500/30">
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                   )}
                   <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-sm shadow-md' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'}`}>
                      {msg.text}
                   </div>
                </div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800">
             <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="How do I find peers?"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-cyan-500 transition-colors text-sm shadow-inner"
                />
                <button type="submit" disabled={!inputMessage.trim()} className="absolute right-2 p-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 rounded-lg text-white transition-colors">
                  <Send className="w-4 h-4" />
                </button>
             </form>
          </div>
        </div>
      )}
    </>
  );
}
