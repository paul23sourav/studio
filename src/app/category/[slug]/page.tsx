'use client';
import { ProductCard } from '@/components/product/product-card';
import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { notFound } from 'next/navigation';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const firestore = useFirestore();
  const categoryName = useMemo(() => 
    params.slug.charAt(0).toUpperCase() + params.slug.slice(1), 
    [params.slug]
  );

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    const productsRef = collection(firestore, 'products');
    return query(
        productsRef, 
        where('status', '==', 'active'),
        where('category', '==', categoryName)
      );
  }, [firestore, categoryName]);
  
  const { data: categoryProducts, loading } = useCollection<Product>(productsQuery);

  if (loading) {
    return (
      <div>
        <section className="bg-card border-b">
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
            <Skeleton className="h-12 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
          </div>
        </section>
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-[250px] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
        </div>
      </div>
    );
  }

  // Since we query by category, if we have a result, we know the category exists.
  // If loading is done and there are no products, we can show the empty state.
  // A 404 would be better if the category itself is invalid, which requires fetching all categories.
  // For now, we'll just show an empty page which is also a valid state.
  
  return (
    <div>
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            {categoryName}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore our collection of premium {categoryName.toLowerCase()}.
          </p>
        </div>
      </section>
      
      <div className="container mx-auto px-4 md:px-6 py-12">
        {categoryProducts && categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold">No products found</h2>
                <p className="text-muted-foreground mt-2">There are currently no products in the {categoryName} category.</p>
            </div>
        )}
      </div>
    </div>
  );
}
