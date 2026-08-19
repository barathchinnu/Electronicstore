const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
};

const categories = [
  { name: 'Earphones', slug: 'earphones', icon: '🎧', description: 'Wired and wireless earphones' },
  { name: 'Headphones', slug: 'headphones', icon: '🎵', description: 'Over-ear and on-ear headphones' },
  { name: 'Smart Watches', slug: 'smart-watches', icon: '⌚', description: 'Fitness trackers and smart watches' },
  { name: 'Speakers', slug: 'speakers', icon: '🔊', description: 'Bluetooth and wired speakers' },
  { name: 'Chargers', slug: 'chargers', icon: '🔌', description: 'Fast chargers and adapters' },
  { name: 'Power Banks', slug: 'power-banks', icon: '🔋', description: 'Portable power banks' },
  { name: 'USB Cables', slug: 'usb-cables', icon: '🔗', description: 'USB-C, Lightning, Micro USB cables' },
  { name: 'Gaming', slug: 'gaming', icon: '🎮', description: 'Gaming accessories and peripherals' },
  { name: 'Laptop Accessories', slug: 'laptop-accessories', icon: '💻', description: 'Laptop bags, stands, and accessories' },
  { name: 'Mobile Accessories', slug: 'mobile-accessories', icon: '📱', description: 'Cases, screen guards, and more' },
  { name: 'Keyboards', slug: 'keyboards', icon: '⌨️', description: 'Mechanical and membrane keyboards' },
  { name: 'Mouse', slug: 'mouse', icon: '🖱️', description: 'Gaming and office mice' },
];

const products = [
  {
    name: 'boAt Airdopes 141',
    brand: 'boAt',
    category: 'Earphones',
    price: 1299,
    originalPrice: 2990,
    discount: 57,
    description: 'True wireless earbuds with 42H playback, beast mode for gaming, and ENx technology for clear calls.',
    specifications: new Map([['Battery Life', '42 Hours'], ['Driver Size', '8mm'], ['Connectivity', 'Bluetooth 5.1'], ['Water Resistance', 'IPX4']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', publicId: '' },
      { url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80', publicId: '' },
    ],
    stock: 45,
    rating: 4.2,
    numReviews: 1250,
    featured: true,
    bestSeller: true,
    flashDeal: true,
    flashDealPrice: 999,
    colors: ['Black', 'White', 'Blue'],
    tags: ['tws', 'earbuds', 'wireless'],
  },
  {
    name: 'Samsung Galaxy Buds2 Pro',
    brand: 'Samsung',
    category: 'Earphones',
    price: 6999,
    originalPrice: 17999,
    discount: 61,
    description: '24-bit Hi-Fi audio, Active Noise Canceling (ANC) with 3 high SNR mics, 360 Audio with direct multi-channel. Available in Bora Purple, White, and Graphite Black.',
    specifications: new Map([['ANC', 'Active Noise Canceling'], ['Battery Life', '29 Hours with Case'], ['Connectivity', 'Bluetooth 5.3'], ['Water Resistance', 'IPX7']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', publicId: '' },
    ],
    stock: 25,
    rating: 4.8,
    numReviews: 432,
    featured: true,
    bestSeller: true,
    flashDeal: true,
    flashDealPrice: 5999,
    colors: ['Bora Purple', 'White', 'Graphite'],
    tags: ['samsung', 'tws', 'anc', 'wireless'],
  },
  {
    name: 'Casio Edifice Chronograph Blue Dial Watch',
    brand: 'Casio',
    category: 'Smart Watches',
    price: 4999,
    originalPrice: 9995,
    discount: 50,
    description: 'Stainless steel band chronograph watch with midnight blue bezel, 100m water resistance, date display, and precision quartz timing.',
    specifications: new Map([['Movement', 'Quartz Chronograph'], ['Water Resistance', '100 Meters'], ['Case Material', 'Stainless Steel'], ['Dial Color', 'Midnight Blue']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80', publicId: '' },
    ],
    stock: 15,
    rating: 4.7,
    numReviews: 310,
    featured: true,
    bestSeller: true,
    flashDeal: false,
    colors: ['Silver Blue'],
    tags: ['watch', 'casio', 'edifice', 'chronograph'],
  },
  {
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'Headphones',
    price: 24999,
    originalPrice: 29999,
    discount: 17,
    description: 'Industry-leading noise canceling headphones with 30-hour battery, multipoint connection, and speak-to-chat technology.',
    specifications: new Map([['Battery Life', '30 Hours'], ['ANC', 'Yes'], ['Connectivity', 'Bluetooth 5.2'], ['Weight', '250g']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', publicId: '' },
      { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80', publicId: '' },
    ],
    stock: 12,
    rating: 4.8,
    numReviews: 892,
    featured: true,
    bestSeller: false,
    flashDeal: false,
    colors: ['Black', 'Silver'],
    tags: ['premium', 'anc', 'wireless'],
  },
  {
    name: 'Noise ColorFit Pro 4',
    brand: 'Noise',
    category: 'Smart Watches',
    price: 2499,
    originalPrice: 5999,
    discount: 58,
    description: '1.72" display smartwatch with 100+ sports modes, SpO2 monitoring, stress tracking, and 7-day battery life.',
    specifications: new Map([['Display', '1.72 inch AMOLED'], ['Battery', '7 Days'], ['Water Resistance', '5 ATM'], ['GPS', 'Yes']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', publicId: '' },
      { url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80', publicId: '' },
    ],
    stock: 30,
    rating: 4.1,
    numReviews: 2341,
    featured: true,
    bestSeller: true,
    flashDeal: true,
    flashDealPrice: 1999,
    colors: ['Black', 'Rose Gold', 'Blue'],
    tags: ['smartwatch', 'fitness', 'health'],
  },
  {
    name: 'JBL Charge 5',
    brand: 'JBL',
    category: 'Speakers',
    price: 14999,
    originalPrice: 19999,
    discount: 25,
    description: 'Waterproof Bluetooth speaker with IP67 rating, powerful sound, 20-hour playtime and powerbank feature.',
    specifications: new Map([['Battery Life', '20 Hours'], ['Water Resistance', 'IP67'], ['Output Power', '30W'], ['Connectivity', 'Bluetooth 5.1']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80', publicId: '' },
    ],
    stock: 18,
    rating: 4.6,
    numReviews: 445,
    featured: false,
    bestSeller: true,
    flashDeal: false,
    colors: ['Black', 'Teal', 'Red'],
    tags: ['bluetooth', 'waterproof', 'outdoor'],
  },
  {
    name: 'Anker 65W GaN Charger',
    brand: 'Anker',
    category: 'Chargers',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    description: 'Ultra-compact 65W GaN charger with 3 ports (2 USB-C + 1 USB-A). Charge laptop, phone and earbuds simultaneously.',
    specifications: new Map([['Power', '65W'], ['Ports', '3 (2x USB-C + 1x USB-A)'], ['Technology', 'GaN III'], ['Compatibility', 'Universal']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80', publicId: '' },
    ],
    stock: 60,
    rating: 4.5,
    numReviews: 780,
    featured: false,
    bestSeller: true,
    flashDeal: false,
    colors: ['White', 'Black'],
    tags: ['fast-charge', 'gan', 'multi-port'],
  },
  {
    name: 'Mi Power Bank 3i 20000mAh',
    brand: 'Mi',
    category: 'Power Banks',
    price: 1799,
    originalPrice: 2499,
    discount: 28,
    description: '20000mAh power bank with 18W fast charging, triple output ports, and USB-C input. Lightweight and compact design.',
    specifications: new Map([['Capacity', '20000mAh'], ['Input', 'USB-C 18W'], ['Output', '3 Ports'], ['Weight', '440g']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&q=80', publicId: '' },
    ],
    stock: 75,
    rating: 4.3,
    numReviews: 3210,
    featured: false,
    bestSeller: true,
    flashDeal: true,
    flashDealPrice: 1499,
    colors: ['Black', 'White'],
    tags: ['powerbank', '20000mah', 'fast-charge'],
  },
  {
    name: 'Razer BlackWidow V4',
    brand: 'Razer',
    category: 'Keyboards',
    price: 12999,
    originalPrice: 15999,
    discount: 19,
    description: 'Mechanical gaming keyboard with Razer Yellow switches, RGB backlighting, and dedicated media keys.',
    specifications: new Map([['Switch', 'Razer Yellow Linear'], ['Backlight', 'RGB Chroma'], ['Connection', 'USB-A'], ['Layout', 'Full Size']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80', publicId: '' },
    ],
    stock: 20,
    rating: 4.7,
    numReviews: 320,
    featured: true,
    bestSeller: false,
    flashDeal: false,
    colors: ['Black'],
    tags: ['gaming', 'mechanical', 'rgb'],
  },
  {
    name: 'Logitech G502 HERO Gaming Mouse',
    brand: 'Logitech',
    category: 'Mouse',
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    description: 'High-performance gaming mouse with HERO 25K sensor, 11 programmable buttons, and adjustable weight system.',
    specifications: new Map([['Sensor', 'HERO 25K'], ['DPI', '100-25600'], ['Buttons', '11 Programmable'], ['Weight', '121g']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80', publicId: '' },
    ],
    stock: 35,
    rating: 4.6,
    numReviews: 567,
    featured: false,
    bestSeller: true,
    flashDeal: false,
    colors: ['Black'],
    tags: ['gaming', 'mouse', 'wired'],
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    brand: 'Apple',
    category: 'Earphones',
    price: 19900,
    originalPrice: 24900,
    discount: 20,
    description: 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio with H2 chip.',
    specifications: new Map([['ANC', 'Adaptive'], ['Battery', '6+30 Hours'], ['Chip', 'Apple H2'], ['Water Resistance', 'IPX4']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1588423771073-b8903febb85d?w=600&q=80', publicId: '' },
    ],
    stock: 8,
    rating: 4.9,
    numReviews: 1890,
    featured: true,
    bestSeller: true,
    flashDeal: false,
    colors: ['White'],
    tags: ['apple', 'premium', 'anc'],
  },
  {
    name: 'Realme Buds Air 5',
    brand: 'Realme',
    category: 'Earphones',
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    description: '50dB ANC, 360° spatial audio, 38H total playback, and fast charging. Premium bass with Hi-Res Audio certification.',
    specifications: new Map([['ANC', '50dB'], ['Battery', '38 Hours'], ['Driver', '12.4mm'], ['Connectivity', 'Bluetooth 5.3']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', publicId: '' },
    ],
    stock: 55,
    rating: 4.3,
    numReviews: 654,
    featured: false,
    bestSeller: false,
    flashDeal: true,
    flashDealPrice: 2499,
    colors: ['Black', 'White', 'Yellow'],
    tags: ['tws', 'anc', 'budget'],
  },
  {
    name: 'Samsung Galaxy Watch 6',
    brand: 'Samsung',
    category: 'Smart Watches',
    price: 22999,
    originalPrice: 26999,
    discount: 15,
    description: 'Advanced health monitoring, BioActive sensor, 40 hours battery, sapphire crystal glass, and Galaxy AI features.',
    specifications: new Map([['Display', '1.5 inch Super AMOLED'], ['Battery', '40 Hours'], ['Water Resistance', '5 ATM'], ['Chip', 'Exynos W930']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80', publicId: '' },
    ],
    stock: 14,
    rating: 4.5,
    numReviews: 423,
    featured: true,
    bestSeller: false,
    flashDeal: false,
    colors: ['Graphite', 'Gold', 'Silver'],
    tags: ['samsung', 'premium', 'health'],
  },
  {
    name: 'Portronics Toad 23 Wireless Mouse',
    brand: 'Portronics',
    category: 'Mouse',
    price: 499,
    originalPrice: 999,
    discount: 50,
    description: 'Ergonomic wireless mouse with 2.4GHz connectivity, 1600 DPI, silent clicks, and 12-month battery life.',
    specifications: new Map([['DPI', '800/1200/1600'], ['Battery', '12 Months'], ['Connection', '2.4GHz Wireless'], ['Buttons', '3']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80', publicId: '' },
    ],
    stock: 90,
    rating: 4.0,
    numReviews: 1120,
    featured: false,
    bestSeller: true,
    flashDeal: true,
    flashDealPrice: 399,
    colors: ['Black', 'White', 'Grey'],
    tags: ['wireless', 'office', 'budget'],
  },
  {
    name: 'Lapcare Laptop Cooling Pad',
    brand: 'Lapcare',
    category: 'Laptop Accessories',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    description: 'Dual fan cooling pad with LED lights, adjustable height, and USB hub. Compatible with laptops up to 17 inches.',
    specifications: new Map([['Fans', '2x 140mm'], ['Compatibility', 'Up to 17"'], ['USB Ports', '2'], ['Speed', '1200 RPM']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80', publicId: '' },
    ],
    stock: 40,
    rating: 3.9,
    numReviews: 340,
    featured: false,
    bestSeller: false,
    flashDeal: false,
    colors: ['Black'],
    tags: ['laptop', 'cooling', 'accessories'],
  },
  {
    name: 'Urbn 10000mAh Power Bank',
    brand: 'Urbn',
    category: 'Power Banks',
    price: 999,
    originalPrice: 1799,
    discount: 44,
    description: 'Ultra-slim 10000mAh power bank with 22.5W fast charging and dual USB output. Only 195g weight.',
    specifications: new Map([['Capacity', '10000mAh'], ['Fast Charge', '22.5W'], ['Weight', '195g'], ['Ports', '2 Output']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&q=80', publicId: '' },
    ],
    stock: 0,
    rating: 4.4,
    numReviews: 876,
    featured: false,
    bestSeller: false,
    flashDeal: false,
    colors: ['Black', 'White'],
    tags: ['slim', 'powerbank', 'fast-charge'],
  },
  {
    name: 'Zebronics Zeb-Duke1 Wireless Headphone',
    brand: 'Zebronics',
    category: 'Headphones',
    price: 1299,
    originalPrice: 2999,
    discount: 57,
    description: 'Wireless over-ear headphone with 60H playback, ANC, built-in mic, and foldable design for portability.',
    specifications: new Map([['Battery', '60 Hours'], ['ANC', 'Yes'], ['Driver', '40mm'], ['Connectivity', 'Bluetooth 5.0']]),
    images: [
      { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80', publicId: '' },
    ],
    stock: 3,
    rating: 3.8,
    numReviews: 289,
    featured: false,
    bestSeller: false,
    flashDeal: false,
    colors: ['Black', 'White'],
    tags: ['budget', 'wireless', 'anc'],
  },
];

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@electrostore.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create test customer
    await User.create({
      name: 'Test User',
      email: 'user@electrostore.com',
      password: 'User@123',
      role: 'customer',
    });

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`📂 ${createdCategories.length} categories created`);

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`📦 ${createdProducts.length} products created`);

    console.log('\n✅ Seed complete!');
    console.log('─────────────────────────────');
    console.log('Admin Login:');
    console.log('  Email   : admin@electrostore.com');
    console.log('  Password: Admin@123');
    console.log('─────────────────────────────');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
