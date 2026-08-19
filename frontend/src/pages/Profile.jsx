import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiEdit2, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, loginUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '' });
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name cannot be empty'); return; }
    setLoading(true);
    try {
      const { data } = await updateProfile({ name: form.name });
      loginUser({ ...user, name: data.data.name });
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-lg mx-auto mt-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 border border-white/10">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-3">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <span className={`badge mt-2 ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {user.role === 'admin' ? '👑 Admin' : '🛒 Customer'}
            </span>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                <FiUser className="text-blue-400 text-sm" /> Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="input-dark w-full"
                  autoFocus
                />
              ) : (
                <div className="input-dark cursor-default text-white">{user.name}</div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                <FiMail className="text-blue-400 text-sm" /> Email
              </label>
              <div className="input-dark cursor-default text-slate-400">{user.email}</div>
              <p className="text-xs text-slate-600 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-1.5">
                <FiCalendar className="text-blue-400 text-sm" /> Member Since
              </label>
              <div className="input-dark cursor-default text-slate-400">
                {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {editing ? (
              <>
                <button onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email }); }}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-all">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-60">
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><FiCheck /> Save</>}
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="flex-1 flex items-center justify-center gap-2 btn-secondary py-2.5">
                <FiEdit2 className="text-sm" /> Edit Profile
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
