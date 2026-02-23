'use server';

import { revalidatePath } from 'next/cache';
import { firestore, storage } from '@/firebase/server';
import { Product } from '@/lib/types';

type ProductData = Omit<Product, 'id'>;

export async function addProduct(id: string, data: ProductData) {
  try {
    await firestore.collection('products').doc(id).set(data);
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/category/[slug]', 'layout');
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Could not create product.');
  }
}

export async function updateProduct(id: string, data: Partial<ProductData>) {
  try {
    await firestore.collection('products').doc(id).update(data);
    revalidatePath('/admin');
    revalidatePath(`/${id}`);
    revalidatePath('/');
    revalidatePath('/category/[slug]', 'layout');
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Could not update product.');
  }
}

function getPathFromUrl(url: string): string | null {
  try {
      const parsedUrl = new URL(url);
      const match = parsedUrl.pathname.match(/\/o\/(.*)/);
      if (match && match[1]) {
          return decodeURIComponent(match[1].split('?')[0]);
      }
      return null;
  } catch (e) {
      console.error(`Invalid URL for storage path extraction: ${url}`, e);
      return null;
  }
}

export async function deleteProduct(id: string, imageUrls: string[]) {
  try {
    const bucket = storage.bucket();
    
    const deletePromises = imageUrls.map(async (url) => {
        const filePath = getPathFromUrl(url);
        if (filePath) {
            try {
                await bucket.file(filePath).delete();
            } catch (error: any) {
                if (error.code !== 404) { // Not found is okay
                    console.error(`Failed to delete image from storage: ${filePath}`, error);
                }
            }
        }
    });

    await Promise.all(deletePromises);

    await firestore.collection('products').doc(id).delete();
    
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/category/[slug]', 'layout');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Could not delete product.');
  }
}
