'use client';

import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import type { Address } from '@/types';

export default function AddressesPage() {
  const { token, user, updateUser } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: 'Home', street: '', city: '', state: '', zip: '', country: 'Nigeria' });
  const addresses = user?.addresses || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await api.addAddress(form, token);
      updateUser({ addresses: res.addresses as Address[] });
      setShowForm(false);
      setForm({ label: 'Home', street: '', city: '', state: '', zip: '', country: 'Nigeria' });
    } catch {
      alert('Failed to add address');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 text-sm">
          <Plus className="h-4 w-4" /> Add Address
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card mb-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Label (e.g. Home)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="input-field" required />
            <input placeholder="Street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="input-field sm:col-span-2" required />
            <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" required />
            <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" required />
            <input placeholder="ZIP" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="input-field" required />
          </div>
          <button type="submit" className="btn-primary mt-4">Save Address</button>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <MapPin className="mb-4 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No saved addresses</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="card p-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-brand-600" />
                <div>
                  <p className="font-semibold">{addr.label} {addr.isDefault && <span className="text-xs text-brand-600">(Default)</span>}</p>
                  <p className="mt-1 text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                  <p className="text-sm text-gray-500">{addr.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
