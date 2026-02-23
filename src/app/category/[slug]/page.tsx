'use client';
import { ProductCard } from '@/components/product/product-card';
import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { notFound } from 'next/navigation';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const firestore = useFirestore();
  const productsQuery = firestore ? collection(firestore, 'products') : null;
  const { data: products, loading } = useCollection<Product>(productsQuery);

  const { categoryProducts, categoryName } = useMemo(() => {
    if (!products) return { categoryProducts: [], categoryName: '' };
    
    const filtered = products.filter(
      (p) => p.category.toLowerCase() === params.slug
    );
    const name = filtered.length > 0 ? filtered[0].category : params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

    return { categoryProducts: filtered, categoryName: name };
  }, [products, params.slug]);

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

  if (!loading && products && categoryProducts.length === 0) {
      // a check to see if the category is valid at all.
      const allCategories = [...new Set(products.map(p => p.category.toLowerCase()))];
      if(!allCategories.includes(params.slug)) {
          notFound();
      }
  }
  
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
        {categoryProducts.length > 0 ? (
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
