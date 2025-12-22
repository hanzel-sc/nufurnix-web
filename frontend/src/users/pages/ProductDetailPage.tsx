import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { CatalogItem } from '../../shared/types';
import { catalogService } from '../services/catalog.service';
import { useCartStore } from '../../store/cart.store';
import { Button } from '../../shared/components/Button';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<CatalogItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (id) {
      loadItem(id);
    }
  }, [id]);

  const loadItem = async (itemId: string) => {
    try {
      setLoading(true);
      const data = await catalogService.getItem(itemId);
      setItem(data);
    } catch (error) {
      console.error('Failed to load item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (item) {
      addItem(item, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!item) {
    return <div className="min-h-screen flex items-center justify-center">Item not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Catalog
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <div className="aspect-video bg-gray-200 rounded-lg mb-4">
                {item.images[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
              {item.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {item.images.slice(1).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${item.name} ${idx + 2}`}
                      className="w-full aspect-square object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {item.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{item.category}</p>
              <p className="text-gray-700 mb-6">{item.description}</p>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Specifications</h2>
                <dl className="space-y-2">
                  {Object.entries(item.specifications).map(([key, value]) => (
                    <div key={key} className="flex">
                      <dt className="font-medium text-gray-700 w-1/3">{key}:</dt>
                      <dd className="text-gray-600">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {item.applications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Applications</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {item.applications.map((app, idx) => (
                      <li key={idx} className="text-gray-700">
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded"
                />
                <Button onClick={handleAddToCart} className="flex-1">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}