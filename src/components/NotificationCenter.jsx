import { useState, useEffect } from 'react';
import { Bell, X, Check, Coffee, Calendar } from 'lucide-react';
import { subscribeToMeetings, updateMeetingStatus } from '../utils/MeetingManager';

export default function NotificationCenter({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    // Subscribe to incoming meeting requests
    const unsubscribe = subscribeToMeetings(user.id, (incoming) => {
        setMeetings(incoming.sort((a,b) => b.timestamp?.seconds - a.timestamp?.seconds));
        setUnreadCount(incoming.filter(m => m.status === 'pending').length);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAction = async (requestId, status) => {
    await updateMeetingStatus(requestId, status);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-cyan-400 bg-cyan-900/40 hover:bg-cyan-900/60 rounded-xl border border-cyan-500/30 transition-all shadow-md group"
      >
        <Bell size={20} className="group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#040914] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
            <div className="p-4 border-b border-cyan-900/50 flex justify-between items-center bg-slate-950/50">
              <h3 className="text-sm font-bold text-white flex items-center">
                <Coffee className="w-4 h-4 mr-2 text-cyan-400" />
                Networking Inbox
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto scrollbar-hide">
              {meetings.length === 0 ? (
                <div className="p-10 text-center">
                  <Calendar className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-xs font-medium">No meeting requests yet.</p>
                </div>
              ) : (
                meetings.map(meeting => (
                  <div key={meeting.id} className={`p-4 border-b border-cyan-900/20 hover:bg-cyan-900/10 transition-all ${meeting.status === 'pending' ? 'bg-cyan-900/5' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-sm text-white font-bold">{meeting.fromName}</p>
                            <p className="text-[10px] text-cyan-400/70 font-semibold tracking-wider uppercase">Wants to meet</p>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            meeting.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 
                            meeting.status === 'declined' ? 'bg-red-500/20 text-red-400' : 
                            'bg-amber-500/20 text-amber-300'
                        }`}>
                            {meeting.status}
                        </span>
                    </div>

                    {meeting.status === 'pending' && (
                        <div className="flex space-x-2 mt-3">
                            <button 
                                onClick={() => handleAction(meeting.id, 'accepted')}
                                className="flex-1 flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-slate-950 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                                <Check className="w-3.5 h-3.5 mr-1" /> Accept
                            </button>
                            <button 
                                onClick={() => handleAction(meeting.id, 'declined')}
                                className="flex-1 flex items-center justify-center bg-slate-800 hover:bg-slate-750 text-slate-400 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                                <X className="w-3.5 h-3.5 mr-1" /> Decline
                            </button>
                        </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="p-3 bg-slate-950/50 text-center">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Powered by AI Concierge</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
