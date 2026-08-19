import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import ProductForm from './ProductForm';
import { createProduct } from '../../services/productService';
import toast from 'react-hot-toast';

export default function AddProduct() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await createProduct(data);
      toast.success('Product published successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/products')}
          className="p-2 rounded-xl glass border border-white/10 text-slate-400 hover:text-white transition-all">
          <FiArrowLeft className="text-sm" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-display text-white">Add New Product</h1>
          <p className="text-slate-400 text-sm">Fill in the details and publish</p>
        </div>
      </div>
      <ProductForm onSubmit={handleSubmit} loading={loading} submitLabel="Publish Product" />
    </div>
  );
}
