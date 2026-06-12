'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1000));
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <section className="bg-brand-600 py-12 sm:py-16" aria-labelledby="newsletter-heading">
      <div className="container-main">
        <div className="mx-auto max-w-2xl text-center">
          <Mail className="mx-auto mb-4 h-10 w-10 text-white/80" aria-hidden="true" />
          <h2 id="newsletter-heading" className="text-2xl font-bold text-white sm:text-3xl">
            Stay in the Loop
          </h2>
          <p className="mt-3 text-brand-100">
            Get exclusive deals, new product alerts, and tech tips delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-2">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 rounded-xl border-0 px-5 py-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-70"
            >
              {status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4" /> Subscribed!
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
          {status === 'success' && (
            <p className="mt-3 text-sm text-white/80" role="status">
              Thank you for subscribing!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
