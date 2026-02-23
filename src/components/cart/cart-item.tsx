'use client';

import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import type { CartItem as CartItemType } from '@/lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Minus, Plus, X } from 'lucide-react';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(0)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            className="h-8 w-12 text-center"
            value={item.quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) handleQuantityChange(val);
            }}
            min="1"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
