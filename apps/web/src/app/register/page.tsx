'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import type { User } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      setAuth(res.user as User, res.token);
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Join TechyMart for a better shopping experience</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8">
          {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>}

          <div className="mb-4">
            <label htmlFor="name" className="mb-1 block text-sm font-medium">Full Name</label>
            <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">Phone (optional)</label>
            <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
            <input id="password" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
          </div>
          <div className="mb-6">
            <label htmlFor="confirm" className="mb-1 block text-sm font-medium">Confirm Password</label>
            <input id="confirm" type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="input-field" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-600 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
