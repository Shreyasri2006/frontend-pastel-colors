import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Eye, EyeOff, Shield } from 'lucide-react';

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@jalraksha.gov.in', password: 'admin123', color: 'text-purple-700' },
  { role: 'Doctor', email: 'doctor@jalraksha.gov.in', password: 'doctor123', color: 'text-sky-700' },
  { role: 'Health Worker', email: 'worker@jalraksha.gov.in', password: 'worker123', color: 'text-sky-700' },
  { role: 'Authority', email: 'authority@jalraksha.gov.in', password: 'auth123', color: 'text-orange-800' },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@jalraksha.gov.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-200/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-200 to-sky-100 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-sky-200/30">
            💧
          </div>
          <h1 className="text-2xl font-bold text-stone-800">JalRaksha AI</h1>
          <p className="text-stone-700 text-sm mt-1">Water-Borne Disease Early Warning System</p>
          <p className="text-stone-500 text-xs mt-1">Northeast India Community Health Platform</p>
        </div>

        {/* Login Card */}
        <div className="card border-orange-100/50">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-4 h-4 text-sky-700" />
            <h2 className="font-semibold text-stone-800">Secure Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-pink-200/20 border border-pink-200/50 rounded-lg px-3 py-2">
                <p className="text-pink-700 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-5 border-t border-orange-100 pt-4">
            <p className="text-xs text-stone-500 mb-2.5 font-medium uppercase tracking-wide">Demo Credentials — Click to autofill:</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_CREDENTIALS.map(cred => (
                <button
                  key={cred.role}
                  onClick={() => fillCredentials(cred)}
                  className="text-left px-3 py-2 rounded-lg bg-orange-100/60 hover:bg-orange-100 border border-orange-100/50 hover:border-orange-200 transition-all"
                >
                  <p className={`text-xs font-semibold ${cred.color}`}>{cred.role}</p>
                  <p className="text-stone-500 text-xs truncate">{cred.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-stone-500 text-xs mt-6">
          Government of India · Ministry of Health & Family Welfare<br />
          National Health Mission — Northeast Initiative
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
