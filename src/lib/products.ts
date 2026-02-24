// This file contains the product data that can be used to seed the Firestore database.
import type { Product } from '@/lib/types';

export const products: Omit<Product, 'id'>[] = [
  {
    name: 'Classic Leather Tote',
    description: 'A timeless tote bag crafted from genuine full-grain leather. Spacious enough for your daily essentials, including a 13-inch laptop. Features an interior zip pocket and a magnetic closure.',
    category: 'Bags',
    material: 'Leather',
    color: 'Brown',
    price: 89.82,
    stock: 50,
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1610290497883-c782b6140306?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590737039478-0e1b6fbe471f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620923910101-d79017c6a018?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618073194093-927b1a4a58d2?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['leather tote', 'brown handbag', 'fashion accessory', 'lifestyle bag'],
    sizes: ['One Size'],
    care: ['Wipe clean with a damp cloth.', 'Use a leather conditioner periodically.'],
  },
  {
    name: 'City-Slicker Umbrella',
    description: 'Stay dry in style with this compact and durable travel umbrella. Features a wind-resistant frame and an automatic open/close mechanism for easy one-handed operation.',
    category: 'Umbrellas',
    material: 'Pongee Fabric',
    color: 'Charcoal',
    price: 45.0,
    stock: 100,
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1542533382-b42a59d8bd39?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519708226487-4d6c4d4a8f9f?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['dark umbrella', 'rainy day', 'city walk'],
    sizes: ['One Size'],
  },
  {
    name: 'Minimalist Cardholder',
    description: 'A slim and sleek cardholder for the modern minimalist. Made from premium Italian leather, it features four card slots and a central compartment for folded bills.',
    category: 'Accessories',
    material: 'Leather',
    color: 'Tan',
    price: 75.0,
    stock: 75,
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1620924046114-4b535fabc3bc?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633535914316-56b27f300d86?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618588528768-7df7437c05b8?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['leather wallet', 'tan cardholder', 'minimal accessory'],
  },
  {
    name: 'Merino Wool Scarf',
    description: 'Wrap yourself in luxury with this ultra-soft scarf made from 100% merino wool. Its generous size allows for versatile styling, providing both warmth and elegance.',
    category: 'Apparel',
    material: 'Wool',
    color: 'Heather Grey',
    price: 120.0,
    stock: 40,
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1612452264519-8b84335b7169?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515206385292-0b8b39a3f2b7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605417242137-97d28c871329?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['wool scarf', 'grey scarf', 'winter fashion'],
    sizes: ['One Size'],
    care: ['Dry clean only.'],
  },
  {
    name: 'Canvas Weekender Bag',
    description: 'The perfect companion for your short getaways. This durable canvas bag is accented with leather details and features a detachable shoulder strap and multiple pockets for organization.',
    category: 'Bags',
    material: 'Canvas',
    color: 'Olive Green',
    price: 180.0,
    stock: 25,
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1509849268619-70e6878b2767?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611933936601-2e6c5ac33496?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605304910323-2641b5a26c48?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['canvas weekender', 'travel duffel', 'green bag'],
    sizes: ['One Size'],
  },
  {
    name: 'Cashmere Beanie',
    description: 'A luxuriously soft and warm beanie knitted from pure cashmere. The ribbed cuff ensures a snug and comfortable fit, making it a winter essential.',
    category: 'Apparel',
    material: 'Cashmere',
    color: 'Navy',
    price: 95.0,
    stock: 60,
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1607345330310-12824c96a75f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576202418580-ab78ab9c7aa5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618350311755-9b2f75a6f3b0?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['navy beanie', 'cashmere hat', 'winter accessory'],
  },
  {
    name: 'The Aviator Sunglasses',
    description: 'Classic aviator sunglasses with a modern twist. Featuring a lightweight metal frame and polarized lenses that provide 100% UV protection.',
    category: 'Accessories',
    material: 'Metal',
    color: 'Gold',
    price: 150.0,
    stock: 80,
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1570831739434-535b0337441c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1625885234383-2280d0a273b3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610137785521-ac32b1a843e9?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['aviator sunglasses', 'gold eyewear', 'fashion glasses'],
  },
  {
    name: 'Storm-Proof Golf Umbrella',
    description: 'A large, vented golf umbrella designed to withstand strong winds. The double-canopy design and fiberglass frame offer superior durability on and off the course.',
    category: 'Umbrellas',
    material: 'Nylon',
    color: 'Black',
    price: 65.0,
    stock: 30,
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1542316841-49a7c3666a4f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543477543-3453b3f2b4e8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543477543-3453b3f2b4e8?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['golf umbrella', 'large black', 'rain protection'],
  },
  {
    name: 'Suede Belt',
    description: 'A versatile belt crafted from soft, genuine suede. The brushed silver buckle adds a touch of understated sophistication to both casual and formal outfits.',
    category: 'Accessories',
    material: 'Suede',
    color: 'Chocolate Brown',
    price: 85.0,
    stock: 90,
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1617196020583-0599a2b7f525?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938384269-0f409543a7a9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617992923507-285d3957b420?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['suede belt', 'brown accessory', 'fashion detail'],
    sizes: ['30', '32', '34', '36', '38'],
  },
  {
    name: 'Nylon Backpack',
    description: 'A lightweight and water-resistant backpack designed for the urban commuter. It includes a padded laptop sleeve and multiple organizational pockets.',
    category: 'Bags',
    material: 'Nylon',
    color: 'Black',
    price: 130.0,
    stock: 45,
    status: 'active',
    imageUrls: [
      'https://images.unsplash.com/photo-1577984144365-b7381f8f30d0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622059340243-7973d72a50f1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578697249876-21f4b8ea9901?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['black backpack', 'nylon rucksack', 'everyday bag'],
  },
];
