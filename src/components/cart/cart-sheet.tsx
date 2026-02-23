'use client';

import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CartItem } from './cart-item';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { useCurrency } from '@/context/currency-context';

export function CartSheet() {
  const { cartItems, cartTotal, itemCount } = useCart();
  const { formatCurrency } = useCurrency();

  return (
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
      <SheetHeader className="px-6">
        <SheetTitle>Cart ({itemCount})</SheetTitle>
      </SheetHeader>
      <Separator />
      {itemCount > 0 ? (
        <>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-6 p-6">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </ScrollArea>
          <Separator />
          <SheetFooter className="p-6 sm:justify-between">
            <div className="text-lg font-semibold">
              <span>Subtotal: </span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/checkout">Checkout</Link>
            </Button>
          </SheetFooter>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <h3 className="text-xl font-semibold">Your cart is empty</h3>
          <p className="text-muted-foreground">Add items to your cart to see them here.</p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </SheetContent>
  );
}
