'use client';

import { useDoc } from '@/firebase/firestore/use-doc';
import { useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { StyleAssistant } from './components/style-assistant';
import AddToCartButton from './components/add-to-cart-button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCurrency } from '@/context/currency-context';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const firestore = useFirestore();
  const productRef = useMemo(() => 
    firestore ? doc(firestore, 'products', params.productId) : null,
    [firestore, params.productId]
  );
  const { data: product, loading } = useDoc<Product>(productRef);
  const { formatCurrency } = useCurrency();

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="flex flex-col">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4 mt-2" />
            <Skeleton className="h-20 w-full mt-6" />
            <div className="mt-8">
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="mt-8 flex-grow space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <div className="mt-16 md:mt-24">
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <Carousel className="w-full">
          <CarouselContent>
            {product.imageUrls.map((url, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square relative bg-card rounded-lg overflow-hidden">
                  <Image
                    src={url}
                    alt={`${product.name} image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    data-ai-hint={product.imageHints?.[index]}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
        
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl text-muted-foreground mt-2">{formatCurrency(product.price)}</p>
          
          <p className="mt-6 text-base leading-relaxed">{product.description}</p>
          
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-8 flex-grow">
            <Accordion type="single" collapsible className="w-full">
              {product.care && product.care.length > 0 && (
                <AccordionItem value="care">
                  <AccordionTrigger>Care Instructions</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.care.map((line, index) => <li key={index}>{line}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
              <AccordionItem value="materials">
                <AccordionTrigger>Materials</AccordionTrigger>
                <AccordionContent>
                  <p>{product.material}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      
      <div className="mt-16 md:mt-24">
        <StyleAssistant product={product} />
      </div>
    </div>
  );
}
