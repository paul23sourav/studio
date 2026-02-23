'use server';

import { revalidatePath } from 'next/cache';
import { firestore } from '@/firebase/server';
import { Product } from '@/lib/types';
import { deleteFile } from '@/firebase/storage';

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

export async function deleteProduct(id: string, imageUrls: string[]) {
  try {
    // Delete images from storage first
    const deletePromises = imageUrls.map(url => deleteFile(url));
    await Promise.all(deletePromises);

    // Delete document from firestore
    await firestore.collection('products').doc(id).delete();
    
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/category/[slug]', 'layout');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Could not delete product.');
  }
}
