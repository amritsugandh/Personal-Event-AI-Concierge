import { CalendarPlus, MapPin, Clock, MessageSquareText } from 'lucide-react';
import { createGoogleCalendarUrl } from '../utils/calendar.js';

const RecommendationCard = ({ session }) => {
  const isNetworking = session.type === 'Networking';
  const tagColor = isNetworking ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
  const cardBorderColor = isNetworking ? 'border-amber-500/30 hover:border-amber-400/50 hover:shadow-amber-500/10' : 'border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-cyan-500/20';

  const tags = session.techStack || session.focus || [];

  return (
    <div className={`relative overflow-hidden bg-slate-900/40 rounded-2xl border ${cardBorderColor} shadow-lg backdrop-blur-xl p-6 transition-all duration-300 group`}>
      {/* Decorative Blur blob inside the card */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isNetworking ? 'bg-amber-500/10' : 'bg-cyan-500/10'}`}></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${tagColor}`}>
            {session.type}
          </span>
          <h3 className="text-xl font-bold mt-4 text-white group-hover:text-cyan-300 transition-colors duration-300">
            {session.title}
          </h3>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-5 mb-5 text-slate-300 text-sm font-medium relative z-10">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-cyan-500" />
          {session.time}
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
          {session.room}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {tags.map((tag, idx) => (
          <span key={idx} className="bg-slate-950/60 text-cyan-100 px-3 py-1 rounded-md text-xs border border-cyan-900/50 font-medium tracking-wide">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 relative z-10">
        <a 
          href={createGoogleCalendarUrl(session)}
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-cyan-600/20 hover:bg-cyan-500 border border-cyan-500/50 hover:border-cyan-400 text-cyan-50 hover:text-slate-950 text-sm font-bold rounded-xl transition-all shadow-md group-hover:shadow-glow-cyan flex-1"
        >
          <CalendarPlus className="w-4 h-4 mr-2" />
          Sync Schedule
        </a>
        
        {!isNetworking && (
          <button 
            type="button"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-cyan-900/50 text-cyan-300 text-sm font-bold rounded-xl transition-all shadow-md group-hover:border-cyan-500/50"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // Simple alert to instruct them to use the chat input since React state is top-down
              alert(`Use the Chat Input! Try asking: "What are the takeaways for ${session.title}?"`);
            }}
          >
            <MessageSquareText className="w-4 h-4 mr-2" />
             Pulse Q&A
          </button>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
