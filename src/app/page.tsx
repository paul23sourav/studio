import { ProductCard } from '@/components/product/product-card';
import { products } from '@/lib/products';

export default function Home() {
  return (
    <div>
      <section className="bg-card border-b">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Effortless Style, Uncompromising Quality
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Discover our curated collection of premium essentials, designed for the modern individual.
          </p>
        </div>
      </section>
      
      <div className="container mx-auto px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-8">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
