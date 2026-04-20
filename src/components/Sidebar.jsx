import { MessageSquare, Plus, LogOut, PanelLeftClose, PanelLeft, Clock, Settings } from 'lucide-react';
import { useState } from 'react';
import ProfileSettings from './ProfileSettings';

const Sidebar = ({ sessions, activeSessionId, onSelectSession, onNewSession, onLogout, user, onUpdateUser, isOpen, toggleSidebar }) => {
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
         <div onClick={toggleSidebar} className="fixed inset-0 bg-[#040914]/80 backdrop-blur-sm z-40 md:hidden"></div>
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#040914] border-r border-cyan-900/50 h-full flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:relative md:flex`}>
         
         {/* User Profile Header */}
         <div className="p-4 mb-2 flex items-center justify-between">
            <div className="bg-slate-900/60 border border-cyan-500/20 px-3 py-2.5 rounded-xl flex items-center space-x-3 w-full shadow-md">
               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shrink-0">
                 {user.name.charAt(0).toUpperCase()}
               </div>
               <div className="overflow-hidden">
                 <p className="text-sm font-bold text-white truncate w-36">{user.name}</p>
                 <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Premium</p>
               </div>
            </div>
            
            <button 
                onClick={() => setShowProfileSettings(true)}
                className="ml-2 p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/20 rounded-lg transition-all"
                title="Edit Profile"
             >
                <Settings size={18} />
             </button>

             {showProfileSettings && (
                <ProfileSettings 
                    user={user} 
                    onClose={() => setShowProfileSettings(false)} 
                    onUpdateSuccess={onUpdateUser}
                />
             )}

             <button onClick={toggleSidebar} className="ml-2 md:hidden text-slate-400 hover:text-white bg-slate-900 p-2 rounded-lg">
                <PanelLeftClose size={20} />
            </button>
         </div>

         {/* New Chat Button */}
         <div className="px-4 mb-4">
            <button 
              onClick={() => { onNewSession(); if(window.innerWidth < 768) toggleSidebar(); }}
              className="w-full flex items-center justify-center py-3 bg-cyan-600/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-50 text-sm font-bold rounded-xl transition-all shadow-md group"
            >
              <Plus className="w-5 h-5 mr-2 text-cyan-400 group-hover:scale-110 transition-transform" />
              New Concierge Chat
            </button>
         </div>

         {/* History List */}
         <div className="flex-1 overflow-y-auto px-4 space-y-1.5 scrollbar-hide">
            <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-3 mt-4">
               <Clock className="w-3.5 h-3.5 mr-1.5 opacity-70" /> Chat History
            </div>
            
            {sessions.length === 0 && <p className="text-slate-600 text-xs text-center mt-6">No historical chats found.</p>}
            
            {sessions.map(s => (
               <button 
                 key={s.id}
                 onClick={() => { onSelectSession(s.id); if(window.innerWidth < 768) toggleSidebar(); }}
                 className={`w-full flex items-center text-left px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${s.id === activeSessionId ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 shadow-glow-cyan' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'}`}
               >
                  <MessageSquare className="w-4 h-4 mr-3 shrink-0 opacity-70" />
                  <span className="truncate w-40">{s.title}</span>
               </button>
            ))}
         </div>

         {/* Logout Base */}
         <div className="p-4 border-t border-cyan-900/50 bg-[#040914]">
            <button 
               onClick={onLogout}
               className="w-full flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-950/30 py-2.5 rounded-xl transition-all text-sm font-bold uppercase tracking-wider"
            >
               <LogOut className="w-4 h-4 mr-2" />
               Secure Logout
            </button>
         </div>
      </div>
    </>
  );
};
export default Sidebar;
