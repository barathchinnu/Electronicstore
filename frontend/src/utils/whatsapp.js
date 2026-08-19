const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '916381603160';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';

/**
 * Generate WhatsApp message for single product Buy Now
 */
export const generateProductWhatsAppMessage = (product, quantity = 1) => {
  const price = product.price * quantity;
  const productUrl = `${SITE_URL}/products/${product._id}`;

  return `Hi Insta Digital Shopping! 👋

I'm interested in purchasing:

🛍️ *${product.name}*
🏷️ Brand: ${product.brand || 'N/A'}
💰 Price: ₹${price.toLocaleString('en-IN')}
📦 Quantity: ${quantity}
🔗 ${productUrl}

Please confirm availability and delivery details. Thank you!`;
};

/**
 * Generate WhatsApp message for cart checkout
 */
export const generateCartWhatsAppMessage = (cartItems, total) => {
  const itemsList = cartItems
    .map(
      (item, index) =>
        `${index + 1}. *${item.name}*\n   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
    )
    .join('\n\n');

  const subtotal = total || cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return `Hi Insta Digital Shopping! 👋

I want to place an order for the following items:

${itemsList}

━━━━━━━━━━━━━━━━
💰 *Total: ₹${subtotal.toLocaleString('en-IN')}*
🚚 Delivery: To be confirmed

Please confirm availability and total price with shipping. Thank you!`;
};

/**
 * Open WhatsApp with encoded message
 */
export const openWhatsApp = (message, targetNumber = WHATSAPP_NUMBER) => {
  const cleanNumber = String(targetNumber).replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Quick buy single product
 */
export const buyNowWhatsApp = (product, quantity = 1) => {
  const message = generateProductWhatsAppMessage(product, quantity);
  openWhatsApp(message);
};

/**
 * Checkout cart via WhatsApp
 */
export const checkoutCartWhatsApp = (cartItems, total) => {
  const message = generateCartWhatsAppMessage(cartItems, total);
  openWhatsApp(message);
};

export const cartWhatsApp = checkoutCartWhatsApp;
