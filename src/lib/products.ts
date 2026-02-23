// This file contains the product data that can be used to seed the Firestore database.
import type { Product } from '@/lib/types';

export const products: Product[] = [
  {
    id: 'classic-leather-tote',
    name: 'Classic Leather Tote',
    description: 'A timeless tote bag crafted from genuine full-grain leather. Spacious enough for your daily essentials, including a 13-inch laptop. Features an interior zip pocket and a magnetic closure.',
    category: 'Bags',
    material: 'Leather',
    color: 'Brown',
    price: 89.82,
    imageUrls: [
      'https://images.unsplash.com/photo-1594223274502-94212534f379?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917865922-de9141f02883?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621609764095-b32635d7dd6d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917865921-fbad90a552b7?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['leather tote', 'brown tote bag', 'women\'s handbag', 'fashion accessory'],
    sizes: ['One Size'],
    care: ['Wipe clean with a damp cloth.', 'Use a leather conditioner periodically.'],
  },
  {
    id: 'city-slicker-umbrella',
    name: 'City-Slicker Umbrella',
    description: 'Stay dry in style with this compact and durable travel umbrella. Features a wind-resistant frame and an automatic open/close mechanism for easy one-handed operation.',
    category: 'Umbrellas',
    material: 'Pongee Fabric',
    color: 'Charcoal',
    price: 45.0,
    imageUrls: [
      'https://images.unsplash.com/photo-1580216646274-5a68c5b967f7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533728334493-54b8da063f27?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506896294371-a8a5b5c1a742?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['black umbrella', 'open umbrella', 'rain accessory'],
    sizes: ['One Size'],
  },
  {
    id: 'minimalist-cardholder',
    name: 'Minimalist Cardholder',
    description: 'A slim and sleek cardholder for the modern minimalist. Made from premium Italian leather, it features four card slots and a central compartment for folded bills.',
    category: 'Accessories',
    material: 'Leather',
    color: 'Tan',
    price: 75.0,
    imageUrls: [
      'https://images.unsplash.com/photo-1601211024036-e4909163c4f7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563435670-3d5f36b6f562?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1557994883-b3a758703a93?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['leather cardholder', 'wallet', 'minimalist accessory'],
  },
  {
    id: 'merino-wool-scarf',
    name: 'Merino Wool Scarf',
    description: 'Wrap yourself in luxury with this ultra-soft scarf made from 100% merino wool. Its generous size allows for versatile styling, providing both warmth and elegance.',
    category: 'Apparel',
    material: 'Wool',
    color: 'Heather Grey',
    price: 120.0,
    imageUrls: [
      'https://images.unsplash.com/photo-1542489564-6e16279e6471?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615467827599-3d5f3ddd3a83?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519011921345-5ac5a407334b?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['wool scarf', 'grey scarf', 'winter accessory'],
    sizes: ['One Size'],
    care: ['Dry clean only.'],
  },
  {
    id: 'canvas-weekender-bag',
    name: 'Canvas Weekender Bag',
    description: 'The perfect companion for your short getaways. This durable canvas bag is accented with leather details and features a detachable shoulder strap and multiple pockets for organization.',
    category: 'Bags',
    material: 'Canvas',
    color: 'Olive Green',
    price: 180.0,
    imageUrls: [
      'https://images.unsplash.com/photo-1587397845943-167de477e38a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566150905458-1bf1b2e20d5e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622536843336-391d175e533e?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['canvas bag', 'travel bag', 'weekender tote'],
    sizes: ['One Size'],
  },
  {
    id: 'cashmere-beanie',
    name: 'Cashmere Beanie',
    description: 'A luxuriously soft and warm beanie knitted from pure cashmere. The ribbed cuff ensures a snug and comfortable fit, making it a winter essential.',
    category: 'Apparel',
    material: 'Cashmere',
    color: 'Navy',
    price: 95.0,
    imageUrls: [
      'https://images.unsplash.com/photo-1594488542232-358f29c62c35?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614055990263-e380585a97f2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618350311755-9b2f75a6f3b0?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['cashmere beanie', 'blue hat', 'winter hat'],
  },
  {
    id: 'the-aviator-sunglasses',
    name: 'The Aviator Sunglasses',
    description: 'Classic aviator sunglasses with a modern twist. Featuring a lightweight metal frame and polarized lenses that provide 100% UV protection.',
    category: 'Accessories',
    material: 'Metal',
    color: 'Gold',
    price: 150.0,
    imageUrls: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577803645773-f92f255379a7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607969852110-4f5539d048b9?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['aviator sunglasses', 'gold sunglasses', 'eyewear'],
  },
  {
    id: 'storm-proof-golf-umbrella',
    name: 'Storm-Proof Golf Umbrella',
    description: 'A large, vented golf umbrella designed to withstand strong winds. The double-canopy design and fiberglass frame offer superior durability on and off the course.',
    category: 'Umbrellas',
    material: 'Nylon',
    color: 'Black',
    price: 65.0,
    imageUrls: [
      'https://images.unsplash.com/photo-1549443224-87a175003635?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525287739958-9a38528f8f55?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542643594-279561274945?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['golf umbrella', 'large umbrella', 'black umbrella'],
  },
  {
    id: 'suede-belt',
    name: 'Suede Belt',
    description: 'A versatile belt crafted from soft, genuine suede. The brushed silver buckle adds a touch of understated sophistication to both casual and formal outfits.',
    category: 'Accessories',
    material: 'Suede',
    color: 'Chocolate Brown',
    price: 85.0,
    imageUrls: [
      'https://images.unsplash.com/photo-1621261159851-a2b85d99619a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524391163456-c56c20f5008b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1619004899161-4c5f9d685e54?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['suede belt', 'brown belt', 'leather belt'],
    sizes: ['30', '32', '34', '36', '38'],
  },
  {
    id: 'nylon-backpack',
    name: 'Nylon Backpack',
    description: 'A lightweight and water-resistant backpack designed for the urban commuter. It includes a padded laptop sleeve and multiple organizational pockets.',
    category: 'Bags',
    material: 'Nylon',
    color: 'Black',
    price: 130.0,
    imageUrls: [
      'https://images.unsplash.com/photo-1553062407-98eeb6e0e5c8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577733975221-87504143a579?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586953208448-b95a8e353b32?q=80&w=1000&auto=format&fit=crop'
    ],
    imageHints: ['nylon backpack', 'black backpack', 'commuter bag'],
  },
];
