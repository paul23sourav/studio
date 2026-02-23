'use client';
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
  const [showSizeWarning, setShowSizeWarning] = useState(false);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setShowSizeWarning(true);
      return;
    }
    addToCart(product, selectedSize);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {product.sizes && product.sizes.length > 0 && (
        <div className="flex-1">
          <Select onValueChange={setSelectedSize} defaultValue={selectedSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {product.sizes.map((size) => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showSizeWarning && !selectedSize && (
            <p className="text-sm text-destructive mt-2">Please select a size.</p>
          )}
        </div>
      )}
      <Button size="lg" onClick={handleAddToCart} className="flex-1">
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  );
}
