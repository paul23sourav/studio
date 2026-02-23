'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { getStyleRecommendations } from '../actions';
import type { StyleRecommendationForProductOutput } from '@/ai/flows/style-recommendation-for-product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function StyleAssistant({ product }: { product: Product }) {
  const [recommendations, setRecommendations] = useState<StyleRecommendationForProductOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await getStyleRecommendations(product);
      setRecommendations(result);
    } catch (e) {
      setError('Sorry, we couldn\'t generate recommendations at this time. Please try again later.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl">AI Style Assistant</CardTitle>
          <p className="text-muted-foreground">Get AI-powered recommendations to complete your look.</p>
        </div>
        <Button onClick={handleGetRecommendations} disabled={loading} size="lg">
          <Wand2 className="mr-2 h-5 w-5" />
          {loading ? 'Generating...' : 'Get Recommendations'}
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
            ))}
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {recommendations && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.recommendations.map((item, index) => (
              <div key={index} className="p-4 border bg-background rounded-lg space-y-2">
                <h3 className="font-semibold text-lg">{item.recommendedItemName}</h3>
                <p className="text-sm text-muted-foreground">{item.recommendedItemCategory}</p>
                <p className="text-sm">{item.reasonForRecommendation}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
