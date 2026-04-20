import { UserPlus, Building2, Coffee, Loader2, Check } from 'lucide-react';
import { useState } from 'react';
import { sendMeetingRequest } from '../utils/MeetingManager';

const PeerCard = ({ peer, currentUser }) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  // Generate a dynamic LinkedIn Search URL containing their name and company!
  const linkedinUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(peer.name + " " + peer.company)}`;
  
  const handleRequestMeeting = async () => {
    if (!currentUser) {
        alert("Please login to request a meeting!");
        return;
    }
    setIsSending(true);
    const res = await sendMeetingRequest(currentUser, peer.id, peer.name);
    setIsSending(false);
    if (res.success) {
        setIsSent(true);
    } else {
        alert(res.error);
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-900/50 rounded-2xl border border-cyan-500/30 shadow-lg backdrop-blur-xl p-5 hover:border-cyan-400/60 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
            {peer.name}
          </h3>
          <p className="text-cyan-400/80 text-sm font-semibold tracking-wide">
            {peer.role}
          </p>
        </div>
        <div className="bg-cyan-500/10 p-2 rounded-full border border-cyan-500/20">
          <Building2 className="w-4 h-4 text-cyan-400" />
        </div>
      </div>
      
      <div className="text-slate-300 text-xs font-semibold mb-4 bg-slate-950/50 inline-block px-2 py-1 rounded-md border border-slate-800">
        @ {peer.company}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {peer.interests.map((interest, idx) => (
          <span key={idx} className="bg-cyan-900/30 text-cyan-100 px-2.5 py-1 rounded-md text-[10px] border border-cyan-800/50 font-bold uppercase tracking-wider">
            {interest}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2">
          <a 
            href={linkedinUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-sm font-bold rounded-xl transition-all border border-cyan-900/50"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            LinkedIn
          </a>
          
          <button
            onClick={handleRequestMeeting}
            disabled={isSending || isSent}
            className={`flex items-center justify-center w-full px-4 py-2.5 font-bold rounded-xl transition-all shadow-md text-sm ${isSent ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-500/50 group-hover:shadow-glow-cyan'}`}
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                isSent ? (
                    <>
                        <Check className="w-4 h-4 mr-2" />
                        Request Sent
                    </>
                ) : (
                    <>
                        <Coffee className="w-4 h-4 h-4 mr-2" />
                        Request Meeting
                    </>
                )
            )}
          </button>
      </div>
    </div>
  );
};

export default PeerCard;
