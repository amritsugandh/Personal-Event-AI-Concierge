import { useState } from 'react';
import { Sparkles, Mail, Lock, User, ArrowRight, X, Loader2 } from 'lucide-react';
import { loginUser, registerUser, loginWithGoogle, updateUserProfile } from '../utils/db.js';

export default function AuthModal({ onAuthSuccess, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    if (isLogin) {
      const res = await loginUser(email, password);
      setIsLoading(false);
      // Fails if password/email incorrect! Genuine validation.
      if (res.error) setError(res.error);
      else onAuthSuccess(res.user);
    } else {
      if(!name) { setError("Name required."); setIsLoading(false); return; }
      const interestsArray = interests.split(',').map(i => i.trim()).filter(i => i !== '');
      const res = await registerUser(email, password, name);
      if (res.success && (bio || interestsArray.length > 0)) {
         await updateUserProfile(res.user.id, { bio, interests: interestsArray });
         res.user = { ...res.user, bio, interests: interestsArray };
      }
      setIsLoading(false);
      if (res.error) setError(res.error);
      else onAuthSuccess(res.user);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    const res = await loginWithGoogle();
    setIsLoading(false);
    if (res.error) setError(res.error);
    else onAuthSuccess(res.user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040914] bg-opacity-95 backdrop-blur-2xl">
      <div className="bg-slate-900/60 border border-cyan-500/30 rounded-3xl p-8 max-w-md w-full shadow-glow-cyan relative overflow-hidden m-4">
        {/* Glow blob */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-slate-200 bg-slate-900/80 p-2 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all z-20" disabled={isLoading}>
          <X size={18} />
        </button>

        <div className="text-center mb-8 relative z-10 pt-4">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-600 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-glow-cyan mb-4">
             <Sparkles className="h-8 w-8 text-slate-950" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">TechConf <span className="text-cyan-400">Concierge</span></h2>
          <p className="text-cyan-200/70 text-sm mt-1">{isLogin ? "Welcome back! Login to continue." : "Create your genuine credentials."}</p>
        </div>

        {error && <div className="mb-4 text-center text-sm font-bold text-red-300 bg-red-900/30 py-3 rounded-xl border border-red-500/50 relative z-10">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-500/50" />
                <input type="text" placeholder="Full Name" required value={name} onChange={e=>setName(e.target.value)} disabled={isLoading} className="w-full bg-slate-950/80 border border-cyan-900/50 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan transition-all disabled:opacity-50" />
              </div>
              <div className="space-y-4">
                <textarea 
                  placeholder="Brief Professional Bio (e.g., Senior Frontend Dev @ Google)" 
                  value={bio} 
                  onChange={e=>setBio(e.target.value)} 
                  disabled={isLoading} 
                  className="w-full bg-slate-950/80 border border-cyan-900/50 text-white rounded-xl px-4 py-3 h-20 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan transition-all disabled:opacity-50 resize-none text-sm"
                />
                <input 
                  type="text" 
                  placeholder="Interests (e.g., React, AI, Java)" 
                  value={interests} 
                  onChange={e=>setInterests(e.target.value)} 
                  disabled={isLoading} 
                  className="w-full bg-slate-950/80 border border-cyan-900/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan transition-all disabled:opacity-50 text-sm"
                />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-500/50" />
            <input type="email" placeholder="Email Address" required value={email} onChange={e=>setEmail(e.target.value)} disabled={isLoading} className="w-full bg-slate-950/80 border border-cyan-900/50 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan transition-all disabled:opacity-50" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-500/50" />
            <input type="password" placeholder="Password" required minLength="6" value={password} onChange={e=>setPassword(e.target.value)} disabled={isLoading} className="w-full bg-slate-950/80 border border-cyan-900/50 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-400 focus:shadow-glow-cyan transition-all disabled:opacity-50" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black tracking-wider uppercase rounded-xl transition-all shadow-md hover:shadow-glow-cyan mt-6 disabled:opacity-70">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {isLogin ? 'Login Securely' : 'Register Securely'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-400 relative z-10">
          {isLogin ? "Don't have an account?" : "Already registered?"}{' '}
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }} disabled={isLoading} className="text-cyan-400 hover:text-cyan-300 font-bold underline decoration-cyan-400/30 underline-offset-4 disabled:opacity-50">
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>

        <div className="relative flex items-center justify-center w-full mt-6 mb-2 relative z-10">
           <div className="absolute border-t border-slate-700 w-full top-1/2"></div>
           <span className="bg-slate-900/60 px-3 text-xs text-slate-500 relative z-10 font-bold uppercase tracking-widest">Or</span>
        </div>

        <button onClick={handleGoogleLogin} disabled={isLoading} className="relative z-10 w-full flex items-center justify-center py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all shadow-md group disabled:opacity-70 mt-4">
           <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
               <path fill="none" d="M1 1h22v22H1z" />
           </svg>
           Continue with Google
        </button>
      </div>
    </div>
  );
}
