import { useState } from 'react';
import { X, Save, User, Hash, Loader2 } from 'lucide-react';
import { updateUserProfile } from '../utils/db.js';

export default function ProfileSettings({ user, onClose, onUpdateSuccess }) {
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [interests, setInterests] = useState(user.interests ? user.interests.join(', ') : '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const interestsArray = interests.split(',').map(i => i.trim()).filter(i => i !== '');
    const updatedData = { name, bio, interests: interestsArray };

    const res = await updateUserProfile(user.id, updatedData);
    setIsLoading(false);
    
    if (res.error) {
      setError(res.error);
    } else {
      onUpdateSuccess({ ...user, ...updatedData });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#040914] bg-opacity-90 backdrop-blur-xl">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative m-4">
        
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-slate-200" disabled={isLoading}>
          <X size={20} />
        </button>

        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
                <User className="w-6 h-6 mr-3 text-cyan-400" />
                Edit Profile
            </h2>
            <p className="text-cyan-200/60 text-sm mt-1">Refine your bio and interests for better matching.</p>
        </div>

        {error && <div className="mb-4 text-center text-sm font-bold text-red-300 bg-red-900/30 py-3 rounded-xl border border-red-500/50">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <input 
                type="text" 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                required 
                disabled={isLoading}
                className="w-full bg-slate-950 border border-cyan-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Professional Bio</label>
            <textarea 
                value={bio} 
                onChange={e=>setBio(e.target.value)} 
                placeholder="What do you do?"
                disabled={isLoading}
                className="w-full bg-slate-950 border border-cyan-900/50 text-white rounded-xl px-4 py-3 h-24 focus:outline-none focus:border-cyan-400 transition-all text-sm resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center">
                <Hash className="w-3 h-3 mr-1" /> Tech Interests
            </label>
            <input 
                type="text" 
                value={interests} 
                onChange={e=>setInterests(e.target.value)} 
                placeholder="React, AI, Python..."
                disabled={isLoading}
                className="w-full bg-slate-950 border border-cyan-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-all text-sm"
            />
            <p className="text-[10px] text-slate-500 ml-1 italic">Comma-separated values.</p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full flex items-center justify-center py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
