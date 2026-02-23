'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import ImageUploader from './image-uploader';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { addProduct, updateProduct } from '../actions';
import { v4 as uuidv4 } from 'uuid';
import { useCurrency } from '@/context/currency-context';
import { CONVERSION_RATES } from '@/context/currency-context';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['Bags', 'Umbrellas', 'Apparel', 'Accessories']),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  stock: z.coerce.number().min(0, 'Stock must be non-negative'),
  status: z.enum(['active', 'draft']),
  material: z.string().min(1, 'Material is required'),
  color: z.string().min(1, 'Color is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { currency } = useCurrency();
  const conversionRate = CONVERSION_RATES[currency];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      category: product?.category ?? 'Bags',
      price: product?.price ? parseFloat((product.price * conversionRate).toFixed(2)) : 0,
      stock: product?.stock ?? 0,
      status: product?.status ?? 'draft',
      material: product?.material ?? '',
      color: product?.color ?? '',
    },
  });

  const [imageUrls, setImageUrls] = useState<string[]>(product?.imageUrls ?? []);
  const [basePriceUsd] = useState(product?.price);

  useEffect(() => {
    if (basePriceUsd !== undefined) {
        const newConversionRate = CONVERSION_RATES[currency];
        setValue('price', parseFloat((basePriceUsd * newConversionRate).toFixed(2)), { shouldValidate: true });
    }
  }, [currency, basePriceUsd, setValue]);


  const onSubmit = async (data: ProductFormData) => {
    if (imageUrls.length === 0) {
        toast({
            variant: "destructive",
            title: "No images",
            description: "Please upload at least one image for the product.",
        });
        return;
    }
    
    const submissionConversionRate = CONVERSION_RATES[currency];
    const priceInUsd = data.price / submissionConversionRate;

    try {
        if (product) {
            await updateProduct(product.id, { ...data, price: priceInUsd, imageUrls });
            toast({
                title: 'Product updated',
                description: `"${data.name}" has been successfully updated.`,
            });
        } else {
            const id = `${data.name.toLowerCase().replace(/\s+/g, '-')}-${uuidv4().split('-')[0]}`;
            await addProduct(id, { ...data, price: priceInUsd, imageUrls });
            toast({
                title: 'Product created',
                description: `"${data.name}" has been successfully created.`,
            });
        }
        router.push('/admin');
        router.refresh();
    } catch (error) {
        console.error("Failed to save product", error);
        toast({
            variant: "destructive",
            title: 'An error occurred',
            description: 'Failed to save the product. Please try again.',
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} />
                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="material">Material</Label>
                    <Input id="material" {...register('material')} />
                    {errors.material && <p className="text-sm text-destructive mt-1">{errors.material.message}</p>}
                </div>
                <div>
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" {...register('color')} />
                    {errors.color && <p className="text-sm text-destructive mt-1">{errors.color.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ({currency})</Label>
                  <Input id="price" type="number" step="0.01" {...register('price')} />
                  {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" {...register('stock')} />
                  {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader existingImageUrls={imageUrls} onImageUrlsChange={setImageUrls} />
            </CardContent>
          </Card>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bags">Bags</SelectItem>
                      <SelectItem value="Umbrellas">Umbrellas</SelectItem>
                      <SelectItem value="Apparel">Apparel</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-8">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}
