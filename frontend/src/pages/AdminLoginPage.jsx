import React, { useState } from 'react';
import { ShieldCheck, LockKeyhole, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminLoginPage({ onNavigate }) {
  const { login, isAdmin } = useAuth();
  const { error } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const account = await login(email.trim(), password);
      if (account?.role !== 'ROLE_ADMIN') {
        error('इस अकाउंट को Admin की अनुमति नहीं है।');
        return;
      }
      onNavigate('admin');
    } catch (err) {
      // AuthContext displays the API error toast.
    } finally {
      setSubmitting(false);
    }
  };

  if (isAdmin) {
    return (
      <section className="min-h-[65vh] flex items-center justify-center p-5">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-3 h-12 w-12 text-emerald-600" />
          <h1 className="text-2xl font-bold">Admin account active</h1>
          <p className="mt-2 text-gray-600">आप Admin के रूप में लॉगिन हैं।</p>
          <button onClick={() => onNavigate('admin')} className="mt-6 w-full rounded-lg bg-amber-400 px-5 py-3 font-bold text-gray-950 hover:bg-amber-300">Open Admin Dashboard</button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="bg-[#131921] px-7 py-7 text-white">
          <div className="mb-3 inline-flex rounded-xl bg-amber-400 p-3 text-slate-950"><ShieldCheck className="h-7 w-7" /></div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-300">केवल अधिकृत स्टोर एडमिन के लिए</p>
        </div>
        <form onSubmit={submit} className="space-y-5 p-7">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Admin Email</span>
            <span className="flex items-center gap-2 rounded-lg border px-3 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">
              <Mail className="h-4 w-4 text-gray-400" />
              <input required type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="आपका Admin email" className="w-full py-3 outline-none" />
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Password</span>
            <span className="flex items-center gap-2 rounded-lg border px-3 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">
              <LockKeyhole className="h-4 w-4 text-gray-400" />
              <input required type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password" className="w-full py-3 outline-none" />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="text-gray-500" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </span>
          </label>
          <button disabled={submitting} className="w-full rounded-lg bg-amber-400 px-5 py-3 font-bold text-gray-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Signing in…' : 'Secure Admin Sign In'}</button>
          <p className="text-xs leading-5 text-gray-500">Customer अकाउंट से Admin Dashboard नहीं खुलेगा। Admin अनुमति सर्वर द्वारा जाँची जाती है।</p>
          <button type="button" onClick={() => onNavigate('home')} className="flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft className="h-4 w-4" /> Back to Store</button>
        </form>
      </div>
    </section>
  );
}
