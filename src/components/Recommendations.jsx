import { Sparkles, Calendar, MapPin, Tag } from 'lucide-react';
import { eventData } from '../data/eventData';

export default function Recommendations({ onSelectRecommendation }) {
  return (
    <section className="pt-4 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Sparkles className="w-5 h-5 mr-3 text-cyan-400" />
          Featured Recommendations
        </h2>
        <span className="text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-full hidden sm:block shadow-md">
          Curated for you
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eventData.slice(0, 4).map((event) => (
          <div 
            key={event.id}
            onClick={() => onSelectRecommendation(`Tell me about ${event.title}`)}
            className="bg-slate-900/40 backdrop-blur-md border border-cyan-900/50 hover:border-cyan-400 hover:bg-slate-800/60 p-5 rounded-2xl cursor-pointer transition-all duration-300 group shadow-md hover:shadow-glow-cyan relative overflow-hidden"
          >
            {/* Hover Glow */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-cyan-500/10 blur-2xl rounded-full group-hover:bg-cyan-500/30 transition-all duration-500"></div>
            
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2 relative z-10">
              {event.title}
            </h3>
            
            <div className="flex flex-col space-y-2 mb-4 relative z-10">
              <div className="flex items-center text-sm font-medium text-slate-400">
                <Calendar className="w-4 h-4 mr-2 text-cyan-500/70" />
                {event.time}
              </div>
              <div className="flex items-center text-sm font-medium text-slate-400">
                <MapPin className="w-4 h-4 mr-2 text-cyan-500/70" />
                {event.room}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 relative z-10">
              {(event.techStack || event.focus || []).map((tag, idx) => (
                <span 
                  key={idx} 
                  className="flex items-center text-[10px] font-bold uppercase tracking-wider bg-slate-950/50 text-cyan-200 border border-cyan-800/50 px-2 py-1 rounded-md"
                >
                  <Tag className="w-3 h-3 mr-1 opacity-70" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
