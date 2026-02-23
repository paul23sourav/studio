'use server';

import { styleRecommendationForProduct } from '@/ai/flows/style-recommendation-for-product';
import type { Product } from '@/lib/types';

async function imageUrlToDataUri(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Error converting image URL to data URI:", error);
    throw new Error("Could not process product image.");
  }
}

export async function getStyleRecommendations(product: Product) {
  const dataUri = await imageUrlToDataUri(product.imageUrl);

  const recommendations = await styleRecommendationForProduct({
    productName: product.name,
    productCategory: product.category,
    productDescription: product.description,
    material: product.material,
    color: product.color,
    productImageUrl: dataUri,
  });

  return recommendations;
}
