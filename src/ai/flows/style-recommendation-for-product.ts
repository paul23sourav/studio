'use server';
/**
 * @fileOverview A Genkit flow that provides AI-powered style recommendations for complementary apparel and accessories
 *               based on a selected product and user preferences.
 *
 * - styleRecommendationForProduct - A function that handles the style recommendation process.
 * - StyleRecommendationForProductInput - The input type for the styleRecommendationForProduct function.
 * - StyleRecommendationForProductOutput - The return type for the styleRecommendationForProduct function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleRecommendationForProductInputSchema = z.object({
  productName: z.string().describe('The name of the selected product.'),
  productCategory: z
    .string()
    .describe('The category of the selected product (e.g., "bag", "umbrella", "apparel", "accessory").'),
  productDescription: z.string().describe('A detailed description of the selected product.'),
  material: z.string().describe('The primary material of the selected product.'),
  color: z.string().describe('The color of the selected product.'),
  productImageUrl: z
    .string()
    .describe(
      "An image of the selected product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type StyleRecommendationForProductInput = z.infer<typeof StyleRecommendationForProductInputSchema>;

const RecommendedItemSchema = z.object({
  recommendedItemName: z.string().describe('The name of the recommended apparel or accessory item.'),
  recommendedItemCategory: z
    .string()
    .describe('The category of the recommended item (e.g., "apparel", "accessory", "footwear").'),
  reasonForRecommendation: z.string().describe('A brief explanation of why this item complements the selected product.'),
});

const StyleRecommendationForProductOutputSchema = z.object({
  recommendations: z.array(RecommendedItemSchema).describe('A list of complementary apparel and accessory recommendations.'),
});
export type StyleRecommendationForProductOutput = z.infer<typeof StyleRecommendationForProductOutputSchema>;

export async function styleRecommendationForProduct(
  input: StyleRecommendationForProductInput
): Promise<StyleRecommendationForProductOutput> {
  return styleRecommendationForProductFlow(input);
}

const styleRecommendationPrompt = ai.definePrompt({
  name: 'styleRecommendationPrompt',
  input: {schema: StyleRecommendationForProductInputSchema},
  output: {schema: StyleRecommendationForProductOutputSchema},
  prompt: `You are an expert fashion stylist. Your task is to provide style recommendations for complementary apparel and accessories for a given product.

Consider the following details about the selected product:
Product Name: {{{productName}}}
Product Category: {{{productCategory}}}
Product Description: {{{productDescription}}}
Material: {{{material}}}
Color: {{{color}}}
Product Image: {{media url=productImageUrl}}

Based on these details, recommend 3 to 5 complementary apparel and accessory items that would create a complete and stylish outfit. For each recommendation, provide the item's name, its category, and a brief reason why it complements the selected product. Focus on creating a sophisticated and premium look that aligns with modern fashion trends.

Output your recommendations as a JSON array of objects.`,
});

const styleRecommendationForProductFlow = ai.defineFlow(
  {
    name: 'styleRecommendationForProductFlow',
    inputSchema: StyleRecommendationForProductInputSchema,
    outputSchema: StyleRecommendationForProductOutputSchema,
  },
  async input => {
    const {output} = await styleRecommendationPrompt(input);
    return output!;
  }
);
