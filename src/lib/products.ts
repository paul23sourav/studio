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
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588195163335-5b4c1a7c3761?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614167097787-de994cb3b7d3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614167097799-73489e5a1b34?q=80&w=1000&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1534579122312-bab3f2c5905d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621999993306-0317f2231e84?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517036639867-5a3b9f3a97a8?q=80&w=1000&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1608221833292-21d1b8238f47?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629961623326-a8385a4a6b2c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618588507024-3015526365aa?q=80&w=1000&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1609249789714-c179c73e0454?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549497538-2785a9f5d122?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512353087810-72d9c2a3e54b?q=80&w=1000&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1566150905458-1bf1b296f777?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605304910323-2641b5a26c48?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584964259599-545220d91244?q=80&w=1000&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1618350311755-9b2f75a6f3b0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576202418580-ab78ab9c7aa5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607345330310-12824c96a75f?q=80&w=1000&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603569428925-c496a8a7c2f3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577804362359-ebb2a837c784?q=80&w=1000&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1599428615-845f4153a152?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543477543-3453b3f2b4e8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542316841-49a7c3666a4f?q=80&w=1000&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1625246313133-77a83a0595a8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542280252-1b6e41b9d9c2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618642335100-2f9a23cb9935?q=80&w=1000&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1553062407-98eeb6e0e5c8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622059340243-7973d72a50f1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578697249876-21f4b8ea9901?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['black backpack', 'nylon rucksack', 'everyday bag'],
  },
];
