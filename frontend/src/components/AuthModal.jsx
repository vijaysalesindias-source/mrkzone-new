import React, { useState } from 'react';
import { X, Lock, Mail, ChevronDown, ChevronRight, AlertCircle, ShieldCheck } from 'lucide-react';
import AmazonLogo from './AmazonLogo';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, login } = useAuth();
  const { success, error, info } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' | 'forgot' | 'otp'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      error('Please enter your registered email');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.sendOtp(email);
      const previewOtp = res.data?.previewOtp;
      if (previewOtp) {
        setOtp(previewOtp);
        success(`Verification code sent! (Demo preview code: ${previewOtp})`);
      } else {
        success('Verification code sent to your email.');
      }
      setMode('otp');
    } catch (err) {
      error(err.message || 'Account not found with this email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.resetPassword({
        email,
        otp,
        newPassword,
      });
      success('Password reset successfully! Please sign in with your new password.');
      setMode('login');
      setPassword(newPassword);
    } catch (err) {
      error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 sm:p-8 border border-gray-300 relative animate-scale-up my-6">

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Amazon Logo Center Top */}
        <div className="flex justify-center mb-5">
          <AmazonLogo variant="dark" className="h-9" />
        </div>

        {/* 1. AMAZON SIGN-IN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sign in</h1>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Email or mobile phone number
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="name@example.com"
                className="w-full border border-gray-400 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-800">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-amazon-link hover:underline hover:text-amazon-linkHover"
                >
                  Forgot your password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="w-full border border-gray-400 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Amazon Amber Sign-in Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amazon-gold hover:bg-amazon-goldHover text-gray-950 font-medium py-2 rounded-lg text-xs shadow-xs border border-amber-400 transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Amazon Terms Notice */}
            <p className="text-[11px] text-gray-600 leading-relaxed pt-1">
              By continuing, you agree to Amazon's{' '}
              <a href="#" className="text-amazon-link hover:underline">Conditions of Use</a> and{' '}
              <a href="#" className="text-amazon-link hover:underline">Privacy Notice</a>.
            </p>

            {/* Need Help Dropdown */}
            <div className="pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-xs text-amazon-link hover:underline flex items-center gap-1 font-medium"
              >
                {showHelp ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span>Need help?</span>
              </button>

              {showHelp && (
                <div className="pl-4 pt-1.5 space-y-1 text-xs">
                  <div>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-amazon-link hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                  <div>
                    <a href="#" className="text-amazon-link hover:underline">
                      Other issues with Sign-In
                    </a>
                  </div>
                </div>
              )}
            </div>
          </form>
        )}

        {/* 2. PASSWORD ASSISTANCE (FORGOT) */}
        {mode === 'forgot' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Password assistance</h1>
            <p className="text-xs text-gray-600 leading-relaxed">
              Enter the email address associated with your Amazon account and we will send you a one-time OTP verification code.
            </p>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="name@example.com"
                className="w-full border border-gray-400 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amazon-gold hover:bg-amazon-goldHover text-gray-950 font-medium py-2 rounded-lg text-xs shadow-xs border border-amber-400 transition disabled:opacity-50"
            >
              {loading ? 'Sending code...' : 'Continue'}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-amazon-link hover:underline font-medium"
              >
                Back to Sign in
              </button>
            </div>
          </form>
        )}

        {/* 3. OTP VERIFICATION & PASSWORD RESET */}
        {mode === 'otp' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Verification required</h1>
            <p className="text-xs text-gray-600">
              For security, enter the 6-digit OTP code sent to <b>{email}</b>.
            </p>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Enter OTP code</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="6-digit code"
                className="w-full text-center font-mono tracking-widest border border-gray-400 rounded-sm px-2.5 py-2 text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Set new password</label>
              <input
                type="password"
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full border border-gray-400 rounded-sm px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amazon-gold hover:bg-amazon-goldHover text-gray-950 font-medium py-2 rounded-lg text-xs shadow-xs border border-amber-400 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Save changes and Sign in'}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-amazon-link hover:underline font-medium"
              >
                Cancel and back to Sign in
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
