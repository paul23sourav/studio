'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrency } from '@/context/currency-context';

export function ProductCard({ product }: { product: Product }) {
  const { formatCurrency } = useCurrency();

  return (
    <Link href={`/${product.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-0">
          <div className="aspect-square relative">
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              data-ai-hint={product.imageHints[0]}
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-muted-foreground mt-1">{formatCurrency(product.price)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
