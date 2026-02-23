'use client';

import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import ProductForm from '../../../components/product-form';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

function EditProductLoading() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
             <div className="flex items-center justify-end gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    )
}

export default function EditProductPage({ params }: { params: { productId: string } }) {
  const firestore = useFirestore();
  const productRef = useMemo(() => 
    firestore ? doc(firestore, 'products', params.productId) : null,
    [firestore, params.productId]
  );
  const { data: product, loading } = useDoc<Product>(productRef);
  
  if (loading) {
    return <EditProductLoading />
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return <ProductForm product={product} />;
}
