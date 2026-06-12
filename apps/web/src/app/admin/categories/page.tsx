'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
  const { token } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', image: '', featured: false });

  const load = () => {
    if (!token) return;
    api.adminGetCategories(token).then((r) => setCategories(r.categories as Category[]));
  };

  useEffect(load, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await api.adminCreateCategory(form, token);
    setForm({ name: '', description: '', image: '', featured: false });
    setShowForm(false);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 text-sm">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 grid gap-4 p-6 sm:grid-cols-2">
          <input placeholder="Category Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
          <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-field" required />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field sm:col-span-2" />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured on homepage</label>
          <button type="submit" className="btn-primary sm:col-span-2">Create Category</button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat._id} className="card overflow-hidden">
            <div className="relative h-32">
              <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="300px" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{cat.name}</h3>
              <p className="text-sm text-gray-500">{cat.productCount} products</p>
              {cat.featured && <span className="mt-2 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">Featured</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
