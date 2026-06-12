'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatPrice } from '@/lib/utils';
import type { Product, Category } from '@/types';

export default function AdminProductsPage() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', shortDescription: '', price: 0, compareAtPrice: 0,
    images: [''], category: '', brand: '', sku: '', stock: 0, featured: false, flashDeal: false, active: true,
  });

  const load = () => {
    if (!token) return;
    Promise.all([
      api.adminGetProducts(token),
      api.adminGetCategories(token),
    ]).then(([p, c]) => {
      setProducts(p.products as Product[]);
      setCategories(c.categories as Category[]);
    });
  };

  useEffect(load, [token]);

  const resetForm = () => {
    setForm({ name: '', description: '', shortDescription: '', price: 0, compareAtPrice: 0, images: [''], category: '', brand: '', sku: '', stock: 0, featured: false, flashDeal: false, active: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const body = {
      ...form,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      stock: Number(form.stock),
      images: form.images.filter(Boolean),
      specifications: [],
      tags: [],
    };

    try {
      if (editing) {
        await api.adminUpdateProduct(editing._id, body, token);
      } else {
        await api.adminCreateProduct(body, token);
      }
      resetForm();
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Delete this product?')) return;
    await api.adminDeleteProduct(id, token);
    load();
  };

  const startEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: product.price,
      compareAtPrice: product.compareAtPrice || 0,
      images: product.images.length ? product.images : [''],
      category: typeof product.category === 'object' ? product.category._id : product.category,
      brand: product.brand || '',
      sku: product.sku,
      stock: product.stock,
      featured: product.featured,
      flashDeal: product.flashDeal,
      active: product.active,
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary py-2 text-sm">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={resetForm}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field sm:col-span-2" required />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field sm:col-span-2 min-h-[100px]" required />
              <input type="number" placeholder="Price" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input-field" required />
              <input type="number" placeholder="Compare at Price" value={form.compareAtPrice || ''} onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })} className="input-field" />
              <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input-field" required />
              <input type="number" placeholder="Stock" value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="input-field" required />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field sm:col-span-2" required>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
              <input placeholder="Image URL" value={form.images[0]} onChange={(e) => setForm({ ...form, images: [e.target.value] })} className="input-field sm:col-span-2" required />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.flashDeal} onChange={(e) => setForm({ ...form, flashDeal: e.target.checked })} /> Flash Deal</label>
              <button type="submit" className="btn-primary sm:col-span-2">{editing ? 'Update' : 'Create'} Product</button>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Product</th>
              <th className="px-4 py-3 text-left font-semibold">Price</th>
              <th className="px-4 py-3 text-left font-semibold">Stock</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                      <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                    <span className="font-medium line-clamp-1">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(product)} className="mr-2 rounded-lg p-2 hover:bg-gray-100"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(product._id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
