export type Product = {
  id: string;
  name: string;
  description: string;
  category: 'Bags' | 'Umbrellas' | 'Apparel' | 'Accessories';
  material: string;
  color: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  sizes?: string[];
  care?: string[];
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
};
