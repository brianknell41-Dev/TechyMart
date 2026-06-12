'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import type { User } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login({ email, password });
      setAuth(res.user as User, res.token);
      const user = res.user as User;
      router.push(user.role === 'admin' ? '/admin' : '/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to your TechyMart account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8">
          {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" autoComplete="email" />
          </div>

          <div className="mb-6">
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Link href="/forgot-password" className="text-xs text-brand-600 hover:underline">Forgot password?</Link>
            </div>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" autoComplete="current-password" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-brand-600 hover:underline">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
