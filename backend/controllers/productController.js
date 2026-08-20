const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    featured,
    bestSeller,
    flashDeal,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};

  // Text search
  if (keyword) {
    query.$text = { $search: keyword };
  }

  // Filters
  if (category) query.category = { $regex: category, $options: 'i' };
  if (brand) query.brand = { $regex: brand, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (rating) query.rating = { $gte: Number(rating) };
  if (featured === 'true') query.featured = true;
  if (bestSeller === 'true') query.bestSeller = true;
  if (flashDeal === 'true') query.flashDeal = true;

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  else if (sort === 'price_desc') sortOption = { price: -1 };
  else if (sort === 'rating') sortOption = { rating: -1 };
  else if (sort === 'discount') sortOption = { discount: -1 };
  else if (sort === 'popular') sortOption = { numReviews: -1, rating: -1 };
  else if (sort === 'newest') sortOption = { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, data: product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, brand, category, price, originalPrice, discount,
    description, specifications, stock, featured, bestSeller,
    flashDeal, flashDealPrice, tags, colors, images,
  } = req.body;

  const product = await Product.create({
    name, brand, category, price, originalPrice, discount,
    description, specifications, stock, featured, bestSeller,
    flashDeal, flashDealPrice, tags, colors, images: images || [],
  });

  res.status(201).json({ success: true, data: product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: updated });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Delete images from Cloudinary
  for (const img of product.images) {
    if (img.publicId) {
      await cloudinary.uploader.destroy(img.publicId);
    }
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Upload product images to Cloudinary
// @route   POST /api/products/upload
// @access  Private/Admin
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const uploadPromises = req.files.map((file) =>
    cloudinary.uploader.upload(file.path, {
      folder: 'electrostore/products',
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    })
  );

  const results = await Promise.all(uploadPromises);
  const images = results.map((r) => ({ url: r.secure_url, publicId: r.public_id }));

  res.json({ success: true, data: images });
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadImages, addReview };
