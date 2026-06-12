'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link
        href={`/products?category=${category.slug}`}
        className="group relative block overflow-hidden rounded-2xl"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-lg font-bold text-white">{category.name}</h3>
            <p className="mt-1 text-sm text-white/80">{category.productCount} products</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              Shop now <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
