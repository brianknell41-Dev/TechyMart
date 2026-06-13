'use client';

import { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function SettingsPage() {
  const { user, token, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.updateProfile(form, token);
      if (res.user) updateUser(res.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">Account Settings</h2>
      <form onSubmit={handleSubmit} className="card max-w-lg p-6">
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input value={user?.email || ''} disabled className="input-field bg-gray-50" />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block text-sm font-medium">Full Name</label>
          <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        </div>
        <div className="mb-6">
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">Phone</label>
          <input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : saved ? <><CheckCircle className="h-5 w-5" /> Saved!</> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}