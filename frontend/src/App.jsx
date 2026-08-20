import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Admin
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ProductList from './admin/products/ProductList';
import AddProduct from './admin/products/AddProduct';
import EditProduct from './admin/products/EditProduct';
import CategoryList from './admin/categories/CategoryList';
import OrderList from './admin/orders/OrderList';
import UserList from './admin/users/UserList';
import BannerList from './admin/banners/BannerList';

function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-800 flex flex-col">
      <Navbar />
      <main className="flex-1 main-content-padding">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
            <Route path="/products" element={<CustomerLayout><Products /></CustomerLayout>} />
            <Route path="/products/:id" element={<CustomerLayout><ProductDetails /></CustomerLayout>} />
            <Route path="/category/:category" element={<CustomerLayout><CategoryPage /></CustomerLayout>} />
            <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
            <Route path="/wishlist" element={<CustomerLayout><Wishlist /></CustomerLayout>} />
            <Route path="/search" element={<CustomerLayout><Search /></CustomerLayout>} />
            <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
            <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
            <Route path="/profile" element={<CustomerLayout><Profile /></CustomerLayout>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="users" element={<UserList />} />
              <Route path="banners" element={<BannerList />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<CustomerLayout><NotFound /></CustomerLayout>} />
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
