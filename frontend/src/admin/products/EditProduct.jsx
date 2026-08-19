import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import ProductForm from './ProductForm';
import { getProduct, updateProduct } from '../../services/productService';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getProduct(id).then(({ data }) => {
      setProduct(data.data);
    }).catch(() => {
      toast.error('Product not found');
      navigate('/admin/products');
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await updateProduct(id, data);
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading type="page" />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/products')}
          className="p-2 rounded-xl glass border border-white/10 text-slate-400 hover:text-white transition-all">
          <FiArrowLeft className="text-sm" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-display text-white">Edit Product</h1>
          <p className="text-slate-400 text-sm line-clamp-1">{product?.name}</p>
        </div>
      </div>
      <ProductForm initialData={product} onSubmit={handleSubmit} loading={saving} submitLabel="Save Changes" />
    </div>
  );
}
