import RecommendationCard from './RecommendationCard';

const ScheduleTimeline = ({ sessions }) => {
  if (!sessions || sessions.length === 0) return null;

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-cyan-500/0 before:via-cyan-500/50 before:to-cyan-500/0">
      {sessions.map((session, index) => (
        <div key={session.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon/Step Indicator */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-cyan-400 bg-slate-950 text-cyan-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:shadow-glow-cyan transition-all duration-300">
            <span className="text-sm font-black">{index + 1}</span>
          </div>
          {/* Card Wrapper */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] pl-3 md:pl-0 pt-2 pb-2">
             <RecommendationCard session={session} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleTimeline;
