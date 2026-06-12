'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Loader2, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setSent(true);
      if (res.resetToken) {
        setResetToken(res.resetToken);
        setStep('reset');
      }
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.resetPassword(resetToken, password);
      setSent(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-main flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
        </div>

        <div className="card p-8">
          {step === 'request' ? (
            <form onSubmit={handleRequest}>
              <p className="mb-4 text-sm text-gray-600">Enter your email and we&apos;ll send reset instructions.</p>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field mb-4" placeholder="Email address" />
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
              </button>
              {sent && !resetToken && (
                <p className="mt-4 text-center text-sm text-green-600">If that email exists, a reset link has been sent.</p>
              )}
            </form>
          ) : (
            <form onSubmit={handleReset}>
              <p className="mb-4 text-sm text-gray-600">Enter your new password.</p>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field mb-4" placeholder="New password" />
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Reset Password'}
              </button>
              {sent && password && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" /> Password reset! <Link href="/login" className="font-semibold underline">Sign in</Link>
                </div>
              )}
            </form>
          )}
          <Link href="/login" className="mt-6 block text-center text-sm text-brand-600 hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
