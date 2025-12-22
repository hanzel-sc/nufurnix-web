import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import { catalogService } from '../services/catalog.service';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [submissionType, setSubmissionType] = useState<'ENQUIRY' | 'ORDER'>('ENQUIRY');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!customerName || !email || !phone) {
      setError('Please fill in all required fields');
      return;
    }

    if (submissionType === 'ORDER' && !deliveryAddress) {
      setError('Delivery address is required for orders');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const response = await catalogService.submitEnquiryOrOrder({
        type: submissionType,
        customerName,
        email,
        phone,
        notes,
        items: items.map((item) => ({
          catalogItemId: item.catalogItem.id,
          quantity: item.quantity,
        })),
        deliveryAddress: submissionType === 'ORDER' ? deliveryAddress : undefined,
      });

      clearCart();
      navigate(`/confirmation/${response.submissionId}`);
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Cart</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Back to Catalog
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Cart</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.catalogItem.id}
                      className="flex items-center gap-4 p-4 border rounded"
                    >
                      <div className="w-20 h-20 bg-gray-200 rounded">
                        {item.catalogItem.images[0] && (
                          <img
                            src={item.catalogItem.images[0]}
                            alt={item.catalogItem.name}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.catalogItem.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.catalogItem.category}
                        </p>
                      </div>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.catalogItem.id,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-20 px-2 py-1 border rounded"
                      />
                      <Button
                        variant="danger"
                        onClick={() => removeItem(item.catalogItem.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Submit Request</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type
                </label>
                <select
                  value={submissionType}
                  onChange={(e) => setSubmissionType(e.target.value as 'ENQUIRY' | 'ORDER')}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="ENQUIRY">Enquiry</option>
                  <option value="ORDER">Order</option>
                </select>
              </div>

              <div className="space-y-4">
                <Input
                  label="Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
                <Input
                  label="Email *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Phone *"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    rows={3}
                  />
                </div>
                {submissionType === 'ORDER' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      rows={3}
                      required
                    />
                  </div>
                )}
              </div>

              {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full mt-6"
              >
                {submitting ? 'Submitting...' : `Submit ${submissionType}`}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}