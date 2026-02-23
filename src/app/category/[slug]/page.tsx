import { ProductCard } from '@/components/product/product-card';
import { products } from '@/lib/products';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const categories = [...new Set(products.map((p) => p.category))];
  return categories.map((category) => ({
    slug: category.toLowerCase(),
  }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === params.slug
  );

  const categoryName = products.find(p => p.category.toLowerCase() === params.slug)?.category;

  if (!categoryName) {
    notFound();
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
