import { useState, useEffect } from 'react';
import ChatInput from './components/ChatInput';
import ScheduleTimeline from './components/ScheduleTimeline';
import PeerCard from './components/PeerCard';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import Recommendations from './components/Recommendations';
import HelpBot from './components/HelpBot';
import NotificationCenter from './components/NotificationCenter';
import { getAIReasoning } from './utils/gemini';
import { performSmartMatching, getNavigationDirection, performEventPulseQA, findMyPeers } from './utils/aiAgent';
import { createNewSession, saveChatSession, getChatSessions, logoutUser } from './utils/db';
import { Compass, Sparkles, Network, PanelLeft, LogIn } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sessionsList, setSessionsList] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Active Session State
  const [currentInputContext, setCurrentInputContext] = useState("");
  const [navDirection, setNavDirection] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [peersData, setPeersData] = useState([]);
  const [aiInsight, setAiInsight] = useState("");

  // Restore authenticated session
  useEffect(() => {
    const storedUser = localStorage.getItem('concierge_active_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadUserSessions(parsedUser.id);
    } else {
      // Default Anonymous State
      setNavDirection("Hello! I am your AI event concierge.\n\nOption 1: Tell me your background to track your itinerary.\nOption 2: Ask me Q&A.\nOption 3: Click the Microphone to use voice commands!");
    }
  }, []);

  const loadUserSessions = async (userId) => {
    const list = await getChatSessions(userId);
    setSessionsList(list);
    if (list.length > 0) {
      loadSessionData(list[list.length - 1]); // Load most recent
    } else {
      await handleNewSession(userId);
    }
  };

  const loadSessionData = (session) => {
    if (!session) return;
    setActiveSessionId(session.id);
    setCurrentInputContext(session.currentInputContext || "");
    setNavDirection(session.navDirection || "");
    setEventsData(session.sessions || []);
    setPeersData(session.peers || []);
  };

  const syncActiveSession = async (updatedSession) => {
    if(!user) return; // Anonymous users do not get persistent history
    await saveChatSession(user.id, updatedSession);
    const list = await getChatSessions(user.id);
    setSessionsList(list);
  };

  const handleNewSession = async (userId = user?.id) => {
    if(!userId) return;
    const initialSession = await createNewSession(userId);
    loadSessionData(initialSession);
    const list = await getChatSessions(userId);
    setSessionsList(list);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setShowAuthModal(false);
    localStorage.setItem('concierge_active_user', JSON.stringify(authenticatedUser));
    // Clear the current anonymous session and load proper ones
    loadUserSessions(authenticatedUser.id);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem('concierge_active_user');
    setSessionsList([]);
    setNavDirection("Hello! I am your AI event concierge.\n\nOption 1: Tell me your background to track your itinerary.\nOption 2: Ask me Q&A.\nOption 3: Click the Microphone to use voice commands!");
    setEventsData([]);
    setPeersData([]);
    setCurrentInputContext("");
    setActiveSessionId(null);
  };
  
  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('concierge_active_user', JSON.stringify(updatedUser));
  };

  const handleSelectSession = (id) => {
    const target = sessionsList.find(s => s.id === id);
    if (target) loadSessionData(target);
  };

  const handleUserMessage = (text) => {
    setIsLoading(true);
    setCurrentInputContext(text);

    setTimeout(async () => {
      try {
        let updatedNavDirection = navDirection;
        let updatedEventsData = eventsData;
        let updatedPeersData = peersData;

        const qaResponse = performEventPulseQA(text);
        if (qaResponse) {
           updatedNavDirection = qaResponse;
           setAiInsight(""); // Clear insights for Q&A
        } else {
           updatedEventsData = performSmartMatching(text, user);
           updatedNavDirection = getNavigationDirection(updatedEventsData);
           updatedPeersData = findMyPeers(text);
           
           // Get AI Reasoning async
           getAIReasoning(user || { name: 'Guest', bio: '', interests: [] }, updatedEventsData, text).then(res => setAiInsight(res));
        }

        setNavDirection(updatedNavDirection);
        setEventsData(updatedEventsData);
        setPeersData(updatedPeersData);
        
        if(user && activeSessionId) {
          const currentSession = sessionsList.find(s=>s.id===activeSessionId);
          const newTitle = text.length > 25 ? text.substring(0, 25) + '...' : text;
          
          const activeSessionObj = {
              id: activeSessionId,
              title: currentSession?.title === "New Search" ? newTitle : (currentSession?.title || newTitle),
              currentInputContext: text,
              navDirection: updatedNavDirection,
              sessions: updatedEventsData,
              peers: updatedPeersData,
              createdAt: currentSession?.createdAt || new Date().toISOString()
          };
          await syncActiveSession(activeSessionObj);
        }
      } catch (err) {
        console.error("Search Error:", err);
        setNavDirection("I encountered an issue processing your request. Please try again or refine your query.");
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const handleManualFindPeers = async () => {
    if (!currentInputContext) {
      alert("Please tell the concierge about your background first so we can match you!");
      return;
    }
    setIsLoading(true);
    try {
      const newPeers = findMyPeers(currentInputContext);
      setPeersData(newPeers);
      
      if (user && activeSessionId) {
        const currentSession = sessionsList.find(s=>s.id===activeSessionId);
        const activeSessionObj = {
            id: activeSessionId,
            title: currentSession?.title || "Search",
            currentInputContext: currentInputContext,
            navDirection: navDirection,
            sessions: eventsData,
            peers: newPeers,
            createdAt: currentSession?.createdAt || new Date().toISOString()
        };
        await syncActiveSession(activeSessionObj);
      }
    } catch (err) {
      console.error("Networking Error:", err);
    } finally {
      setIsLoading(false);
    }
    document.getElementById("peers-section")?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`${user ? 'h-screen flex' : 'min-h-screen relative'} bg-[#040914] font-sans selection:bg-cyan-500/30 text-slate-100 overflow-hidden`}>
      
      {showAuthModal && (
        <AuthModal 
          onAuthSuccess={handleAuthSuccess} 
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Dynamic Left ChatGPT Sidebar */}
      {user && (
        <Sidebar 
            isOpen={isSidebarOpen} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            sessions={sessionsList}
            activeSessionId={activeSessionId}
            onSelectSession={handleSelectSession}
            onNewSession={() => handleNewSession()}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            user={user}
        />
      )}

      {/* Main Context Panel */}
      <div className={`flex-1 flex flex-col ${user ? 'h-screen overflow-hidden' : 'w-full'} relative`}>
          
          {/* Header */}
          <header className={`sticky top-0 z-40 border-b border-cyan-900/50 bg-[#040914]/80 backdrop-blur-xl shrink-0 ${!user ? 'shadow-xl' : ''}`}>
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {user && (
                  <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 text-cyan-400 bg-cyan-900/40 rounded-lg border border-cyan-500/30 mr-2 shadow-md"
                  >
                    <PanelLeft size={20} />
                  </button>
                )}
                <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 md:p-2.5 rounded-xl shadow-glow-cyan hidden sm:block">
                  <Compass className="h-5 w-5 md:h-6 md:w-6 text-slate-950" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-white leading-tight tracking-wide">TechConf <span className="text-cyan-400">Concierge</span></h1>
                  <p className="text-[9px] md:text-[10px] text-cyan-200/70 font-semibold tracking-widest uppercase flex items-center mt-0.5"><Sparkles className="w-3 h-3 mr-1 text-amber-400"/> AI-Powered Experience</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {eventsData.length > 0 && (
                  <button onClick={handleManualFindPeers} className="hidden sm:flex items-center px-4 py-2 bg-slate-900 border border-cyan-500/50 hover:bg-cyan-500/20 text-cyan-300 text-sm font-bold rounded-xl transition-all shadow-md">
                      <Network className="w-4 h-4 mr-2" />
                      Find Peers
                  </button>
                )}
                {user && (
                  <NotificationCenter user={user} />
                )}
                {!user && (
                   <button onClick={() => setShowAuthModal(true)} className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-glow-cyan">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login / Signup
                   </button>
                )}
              </div>
            </div>
          </header>

          {/* Scrolling Main Layout Canvas */}
          <main className="flex-1 overflow-y-auto w-full pb-20 scrollbar-hide">
            <div className="max-w-4xl mx-auto px-4 mt-8 flex flex-col space-y-10">
              
              {!user && (
                <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-2xl p-4 text-center">
                  <p className="text-cyan-200/80 text-sm font-medium">Want to save your itinerary history and searches permanently? <button onClick={()=>setShowAuthModal(true)} className="text-cyan-400 font-bold underline">Login to your account!</button></p>
                </div>
              )}

              {/* Navigation & Chat Output Glass Panel */}
              <section className="bg-slate-900/40 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden group transition-all duration-500">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full group-hover:bg-cyan-500/20 transition-all duration-700"></div>
                
                <div className="flex items-start space-x-4 relative z-10 w-full">
                  <div className="bg-cyan-500 rounded-full p-2 mt-1 shadow-glow-cyan shrink-0">
                    <Sparkles className="h-5 w-5 text-slate-950" />
                  </div>
                  <div className="w-full">
                    <h2 className="text-lg font-semibold text-white mb-2 pb-2 border-b border-cyan-500/20">Concierge Response</h2>
                    <div className="text-cyan-50 leading-relaxed text-[15px] whitespace-pre-wrap">
                      {isLoading ? (
                        <span className="flex space-x-1 items-center font-bold tracking-widest text-lg text-cyan-400">
                          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                        </span>
                      ) : (
                        <>
                          <div>{navDirection}</div>
                          {aiInsight && (
                            <div className="mt-4 p-4 bg-cyan-500/5 border-l-2 border-cyan-500/30 rounded-r-xl text-cyan-200/90 italic text-sm animate-in fade-in slide-in-from-left-2 duration-700">
                                <p className="font-bold text-[10px] uppercase tracking-widest text-cyan-500 mb-1 flex items-center">
                                  <Sparkles className="w-3 h-3 mr-1" /> Concierge Insight
                                </p>
                                {aiInsight}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Input area */}
              <section className={`sticky top-2 z-30 ${!user ? 'drop-shadow-2xl' : ''}`}>
                  <ChatInput onSendMessage={handleUserMessage} />
              </section>

              {/* Timeline Items */}
              <section className="pt-2">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center shrink-0">
                      Your Itinerary Map
                      {eventsData.length > 0 && <span className="ml-4 text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-full shadow-glow-cyan mt-1 hidden sm:inline-block">{eventsData.length} Sessions</span>}
                    </h2>
                </div>
                
                {eventsData.length > 0 ? (
                  <ScheduleTimeline sessions={eventsData} />
                ) : (
                  <div className="text-center py-20 border border-dashed border-cyan-500/30 rounded-3xl bg-slate-900/40 backdrop-blur-sm">
                      <Compass className="h-12 w-12 text-cyan-600/50 mx-auto mb-4" />
                      <p className="text-cyan-300/50 font-semibold tracking-wide">Use voice or text to generate a session matrix.</p>
                  </div>
                )}
              </section>

              {/* Intelligent Recommendations Block */}
              <Recommendations onSelectRecommendation={handleUserMessage} />

              {/* Smart Networking Matches Output */}
              {peersData.length > 0 && (
                <section id="peers-section" className="pt-8 border-t border-cyan-900/50">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <Network className="w-7 h-7 mr-3 text-cyan-400" />
                        Smart Networking Ties
                    </h2>
                    <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-full hidden sm:block shadow-md">Top Connections</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {peersData.map(peer => (
                        <PeerCard key={peer.id} peer={peer} currentUser={user} />
                      ))}
                  </div>
                </section>
              )}
            </div>
          </main>
      </div>
      
      {/* Floating Platform Support Bot */}
      <HelpBot />
    </div>
  );
}

export default App;
