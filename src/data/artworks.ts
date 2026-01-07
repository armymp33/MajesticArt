export interface ProductVariant {
  productTypeId: string;
  size: string;
  image: string;
  price: number;
}

export interface Artwork {
  id: string;
  title: string;
  category: 'paintings' | 'digital' | 'mixed-media';
  image: string; // Main/thumbnail image (fallback)
  price: number; // Base price (fallback)
  description: string;
  dimensions: string;
  year: number;
  available: boolean;
  display_location?: 'homepage' | 'gallery' | 'shop' | 'all' | 'none';
  productVariants?: ProductVariant[]; // Product type -> size -> image mapping
}

export const artworks: Artwork[] = [
  {
    id: '1',
    title: 'Ethereal Dawn',
    category: 'paintings',
    image: '/japanese-countryside.png',
    price: 850,
    description: 'A meditation on the first light of day, capturing the delicate transition between night and morning.',
    dimensions: '24" x 36"',
    year: 2024,
    available: true
  },
  {
    id: '2',
    title: 'Golden Whispers',
    category: 'paintings',
    image: '/japanese-imperial-te.png',
    price: 1200,
    description: 'Layers of gold and violet intertwine in this exploration of silence and sound.',
    dimensions: '30" x 40"',
    year: 2024,
    available: true
  },
  {
    id: '3',
    title: 'Velvet Horizon',
    category: 'mixed-media',
    image: '/japanese-countryside.png',
    price: 950,
    description: 'Mixed media piece combining acrylic and metallic leaf on textured canvas.',
    dimensions: '24" x 24"',
    year: 2023,
    available: true
  },
  {
    id: '4',
    title: 'Luminous Path',
    category: 'paintings',
    image: 'https://d64gsuwffb70l.cloudfront.net/69549e688cb668ba97a5ab47_1767153356090_41eb7bcb.png',
    price: 1100,
    description: 'An abstract journey through light and shadow, inviting contemplation.',
    dimensions: '36" x 48"',
    year: 2024,
    available: true
  },
  {
    id: '5',
    title: 'Soft Reverie',
    category: 'digital',
    image: 'https://d64gsuwffb70l.cloudfront.net/69549e688cb668ba97a5ab47_1767153355064_2bfdb570.jpg',
    price: 450,
    description: 'Digital artwork exploring the boundaries between dreams and reality.',
    dimensions: 'Digital (Various sizes)',
    year: 2024,
    available: true
  },
  {
    id: '6',
    title: 'Charcoal Dreams',
    category: 'paintings',
    image: 'https://d64gsuwffb70l.cloudfront.net/69549e688cb668ba97a5ab47_1767153352659_58dcf0af.jpg',
    price: 780,
    description: 'Deep charcoal tones meet brushed gold in this contemplative piece.',
    dimensions: '20" x 30"',
    year: 2023,
    available: true
  },
  {
    id: '7',
    title: 'Midnight Gold',
    category: 'mixed-media',
    image: '/japanese-imperial-te.png',
    price: 1350,
    description: 'A bold statement piece featuring gold leaf on deep charcoal background.',
    dimensions: '40" x 40"',
    year: 2024,
    available: true
  },
  {
    id: '8',
    title: 'Silent Symphony',
    category: 'paintings',
    image: 'https://d64gsuwffb70l.cloudfront.net/69549e688cb668ba97a5ab47_1767153374248_b4bd7f25.jpg',
    price: 920,
    description: 'Musical inspiration translated into visual harmony.',
    dimensions: '28" x 36"',
    year: 2024,
    available: true
  },
  {
    id: '9',
    title: 'Violet Essence',
    category: 'digital',
    image: 'https://d64gsuwffb70l.cloudfront.net/69549e688cb668ba97a5ab47_1767153385600_6ecea66a.png',
    price: 380,
    description: 'Digital exploration of color and form in soft violet tones.',
    dimensions: 'Digital (Various sizes)',
    year: 2024,
    available: true
  },
  {
    id: '10',
    title: 'Gilded Moments',
    category: 'mixed-media',
    image: 'https://d64gsuwffb70l.cloudfront.net/69549e688cb668ba97a5ab47_1767153381093_000d43f9.png',
    price: 1450,
    description: 'Capturing fleeting moments in gold and shadow.',
    dimensions: '36" x 36"',
    year: 2024,
    available: true
  },
  {
    id: '11',
    title: 'Whispered Light',
    category: 'paintings',
    image: 'https://d64gsuwffb70l.cloudfront.net/69549e688cb668ba97a5ab47_1767153376582_8183c782.jpg',
    price: 890,
    description: 'Soft light filtering through abstract forms.',
    dimensions: '24" x 32"',
    year: 2023,
    available: true
  },
  {
    id: '12',
    title: 'Abstract Serenity',
    category: 'digital',
    image: 'https://d64gsuwffb70l.cloudfront.net/69549e688cb668ba97a5ab47_1767153381190_d3810ce0.png',
    price: 420,
    description: 'A digital meditation on peace and tranquility.',
    dimensions: 'Digital (Various sizes)',
    year: 2024,
    available: true
  }
];

export const heroImage = '/japanese-countryside.png';
export const artistImage = '/japanese-imperial-te.png';

export interface CommissionTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  deliveryTime: string;
  popular?: boolean;
}

export const commissionTiers: CommissionTier[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    price: '$350',
    description: 'Perfect for smaller spaces or gifts',
    features: [
      'Up to 12" x 16" canvas',
      'Single subject or simple composition',
      '2 revision rounds',
      'Digital preview before shipping',
      'Certificate of authenticity'
    ],
    deliveryTime: '2-3 weeks'
  },
  {
    id: 'silver',
    name: 'Silver',
    price: '$750',
    description: 'Our most popular choice',
    features: [
      'Up to 24" x 36" canvas',
      'Complex compositions welcome',
      '4 revision rounds',
      'Progress updates throughout',
      'Premium packaging & shipping',
      'Certificate of authenticity'
    ],
    deliveryTime: '3-4 weeks',
    popular: true
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '$1,500+',
    description: 'Statement pieces & large installations',
    features: [
      'Up to 48" x 60" or custom size',
      'Multi-panel or installation work',
      'Unlimited revisions',
      'In-person consultation available',
      'White glove delivery & installation',
      'Lifetime authenticity guarantee'
    ],
    deliveryTime: '4-8 weeks'
  }
];

export interface PrintOption {
  id: string;
  name: string;
  basePrice: number;
  sizes: { size: string; price: number }[];
}

export const printOptions: PrintOption[] = [
  {
    id: 'canvas',
    name: 'Canvas',
    basePrice: 45,
    sizes: [
      { size: '8" x 8"', price: 45 },
      { size: '8" x 10"', price: 55 },
      { size: '8" x 12"', price: 65 },
      { size: '8" x 14"', price: 75 },
      { size: '10" x 10"', price: 65 },
      { size: '10" x 12"', price: 75 },
      { size: '10" x 14"', price: 85 },
      { size: '12" x 12"', price: 85 },
      { size: '12" x 16"', price: 95 },
      { size: '12" x 18"', price: 105 },
      { size: '12" x 20"', price: 115 },
      { size: '14" x 18"', price: 115 },
      { size: '16" x 16"', price: 125 },
      { size: '16" x 20"', price: 135 },
      { size: '16" x 24"', price: 155 },
      { size: '16" x 30"', price: 195 },
      { size: '18" x 24"', price: 165 },
      { size: '20" x 24"', price: 185 },
      { size: '20" x 30"', price: 215 },
      { size: '24" x 24"', price: 225 },
      { size: '24" x 30"', price: 245 },
      { size: '24" x 36"', price: 275 },
      { size: '24" x 40"', price: 295 }
    ]
  },
  {
    id: 'canvas-wall-hanging',
    name: 'Canvas Wall Hanging',
    basePrice: 50,
    sizes: [
      { size: '8" x 8"', price: 50 },
      { size: '8" x 10"', price: 60 },
      { size: '8" x 12"', price: 70 },
      { size: '8" x 14"', price: 80 },
      { size: '10" x 10"', price: 70 },
      { size: '10" x 12"', price: 80 },
      { size: '10" x 14"', price: 90 },
      { size: '12" x 12"', price: 90 },
      { size: '12" x 16"', price: 100 },
      { size: '12" x 18"', price: 110 },
      { size: '12" x 20"', price: 120 },
      { size: '14" x 18"', price: 120 },
      { size: '16" x 16"', price: 130 },
      { size: '16" x 20"', price: 140 },
      { size: '16" x 24"', price: 160 },
      { size: '16" x 30"', price: 200 },
      { size: '18" x 24"', price: 170 },
      { size: '20" x 24"', price: 190 },
      { size: '20" x 30"', price: 220 },
      { size: '24" x 24"', price: 230 },
      { size: '24" x 30"', price: 250 },
      { size: '24" x 36"', price: 280 },
      { size: '24" x 40"', price: 300 }
    ]
  },
  {
    id: 'framed-photo-black-matte',
    name: 'Framed Photo - Black Matte',
    basePrice: 95,
    sizes: [
      { size: '8" x 8"', price: 95 },
      { size: '8" x 12"', price: 105 },
      { size: '12" x 16"', price: 125 },
      { size: '16" x 16"', price: 135 },
      { size: '16" x 20"', price: 155 },
      { size: '20" x 30"', price: 195 }
    ]
  },
  {
    id: 'framed-photo-oak-vintage-flair',
    name: 'Framed Photo - Oak Vintage Flair',
    basePrice: 100,
    sizes: [
      { size: '8" x 8"', price: 100 },
      { size: '8" x 12"', price: 110 },
      { size: '12" x 16"', price: 130 },
      { size: '16" x 16"', price: 140 },
      { size: '16" x 20"', price: 160 },
      { size: '20" x 30"', price: 200 }
    ]
  },
  {
    id: 'framed-photo-vintage-silver',
    name: 'Framed Photo - Vintage Silver',
    basePrice: 105,
    sizes: [
      { size: '8" x 8"', price: 105 },
      { size: '8" x 12"', price: 115 },
      { size: '12" x 16"', price: 135 },
      { size: '16" x 16"', price: 145 },
      { size: '16" x 20"', price: 165 },
      { size: '20" x 30"', price: 205 }
    ]
  },
  {
    id: 'framed-photo-walnut-flair',
    name: 'Framed Photo - Walnut Flair',
    basePrice: 100,
    sizes: [
      { size: '8" x 8"', price: 100 },
      { size: '8" x 12"', price: 110 },
      { size: '12" x 16"', price: 130 },
      { size: '16" x 16"', price: 140 },
      { size: '16" x 20"', price: 160 },
      { size: '20" x 30"', price: 200 }
    ]
  },
  {
    id: 'framed-photo-white',
    name: 'Framed Photo - White',
    basePrice: 95,
    sizes: [
      { size: '8" x 8"', price: 95 },
      { size: '8" x 12"', price: 105 },
      { size: '12" x 16"', price: 125 },
      { size: '16" x 16"', price: 135 },
      { size: '16" x 20"', price: 155 },
      { size: '20" x 30"', price: 195 }
    ]
  },
  {
    id: 'poster',
    name: 'Poster',
    basePrice: 25,
    sizes: [
      { size: '12" x 18"', price: 25 },
      { size: '18" x 24"', price: 35 },
      { size: '24" x 36"', price: 50 }
    ]
  },
  {
    id: 'photo-mug',
    name: 'Photo Mug',
    basePrice: 20,
    sizes: [
      { size: 'Left Landscape', price: 20 },
      { size: 'Left', price: 20 },
      { size: 'Right Landscape', price: 20 },
      { size: 'Right', price: 20 }
    ]
  },
  {
    id: 'magic-mug',
    name: 'Magic Mug',
    basePrice: 25,
    sizes: [
      { size: 'Left Landscape', price: 25 },
      { size: 'Left', price: 25 },
      { size: 'Right Landscape', price: 25 },
      { size: 'Right', price: 25 }
    ]
  },
  {
    id: 'photo-ornament',
    name: 'Photo Ornament',
    basePrice: 15,
    sizes: [
      { size: 'Standard', price: 15 }
    ]
  },
  {
    id: 'picture-frame-ornament',
    name: 'Picture Frame Ornament',
    basePrice: 18,
    sizes: [
      { size: '2" x 3"', price: 18 }
    ]
  },
  {
    id: 'pillow',
    name: 'Pillow',
    basePrice: 35,
    sizes: [
      { size: '12" x 12"', price: 35 },
      { size: '16" x 16"', price: 45 },
      { size: '18" x 18"', price: 55 }
    ]
  },
  {
    id: 'premium-plush-pillow',
    name: 'Premium Plush Pillow',
    basePrice: 55,
    sizes: [
      { size: '12" x 12"', price: 55 },
      { size: '16" x 16"', price: 65 },
      { size: '18" x 18"', price: 75 }
    ]
  },
  {
    id: 'fleece-blanket',
    name: 'Fleece Blanket',
    basePrice: 45,
    sizes: [
      { size: '27" x 40"', price: 45 },
      { size: '40" x 60"', price: 55 },
      { size: '60" x 80"', price: 65 }
    ]
  },
  {
    id: 'premium-plush-blanket',
    name: 'Premium Plush Blanket',
    basePrice: 75,
    sizes: [
      { size: '50" x 60"', price: 75 },
      { size: '60" x 80"', price: 95 }
    ]
  },
  {
    id: 'puzzle',
    name: 'Puzzle',
    basePrice: 25,
    sizes: [
      { size: '500 pieces', price: 25 },
      { size: '1000 pieces', price: 35 }
    ]
  },
  {
    id: 'rug-doormat',
    name: 'Rug/Doormat',
    basePrice: 40,
    sizes: [
      { size: '18" x 30"', price: 40 },
      { size: '24" x 36"', price: 55 }
    ]
  },
  {
    id: 'towel',
    name: 'Towel',
    basePrice: 30,
    sizes: [
      { size: 'Bath Towel', price: 30 },
      { size: 'Beach Towel', price: 40 }
    ]
  },
  {
    id: 'keyring-heart',
    name: 'Keyring Heart',
    basePrice: 12,
    sizes: [
      { size: 'Standard', price: 12 }
    ]
  },
  {
    id: 'metal',
    name: 'Metal Print',
    basePrice: 45,
    sizes: [
      { size: '8" x 8"', price: 45 },
      { size: '8" x 10"', price: 50 },
      { size: '8" x 12"', price: 55 },
      { size: '11" x 14"', price: 70 },
      { size: '12" x 16"', price: 75 },
      { size: '12" x 18"', price: 85 }
    ]
  },
  {
    id: 'photo-holder',
    name: 'Photo Holder',
    basePrice: 20,
    sizes: [
      { size: '5" x 7"', price: 20 },
      { size: '6" x 6"', price: 22 },
      { size: '8" x 10"', price: 25 }
    ]
  },
  {
    id: 'photo-wooden-snowflake',
    name: 'Photo Wooden Snowflake',
    basePrice: 22,
    sizes: [
      { size: 'Standard', price: 22 }
    ]
  },
  {
    id: 'photoboard',
    name: 'Photoboard',
    basePrice: 30,
    sizes: [
      { size: '8" x 8"', price: 30 },
      { size: '8" x 12"', price: 35 },
      { size: '12" x 16"', price: 45 }
    ]
  }
];
