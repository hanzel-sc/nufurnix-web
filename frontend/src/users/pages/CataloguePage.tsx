import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CatalogItem } from '../../shared/types';
import { catalogService } from '../services/catalog.service';
import { useCartStore } from '../../store/cart.store';

export default function CatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const cartItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    loadCatalog();
  }, [category]);

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const data = await catalogService.getCatalog(category || undefined);
      setItems(data);

      const uniqueCategories = Array.from(new Set(data.map((item) => item.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">NuFurnix Catalog</h1>
          <Link to="/cart" className="relative">
            <span className="text-lg">🛒 Cart</span>
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {cartItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200 rounded-t-lg">
                  {item.images[0] && (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}