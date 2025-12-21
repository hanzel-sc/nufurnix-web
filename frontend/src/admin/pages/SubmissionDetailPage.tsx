import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Submission, OrderStatus } from '../../shared/types';
import { adminService } from '../services/admin.service';
import { Button } from '../../shared/components/Button';

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('PLACED');

  useEffect(() => {
    if (id) {
      loadSubmission(id);
    }
  }, [id]);

  const loadSubmission = async (submissionId: string) => {
    try {
      setLoading(true);
      const data = await adminService.getSubmission(submissionId);
      setSubmission(data);
      if (data.order) {
        setSelectedStatus(data.order.orderStatus);
      }
    } catch (error) {
      console.error('Failed to load submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!submission || !id) return;

    setUpdating(true);
    try {
      await adminService.updateOrderStatus(id, selectedStatus);
      await loadSubmission(id);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Submission not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            to="/admin/submissions"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Submissions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Submission Details
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-gray-900">{submission.customerName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-gray-900">{submission.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-gray-900">{submission.phone}</dd>
                </div>
                {submission.notes && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="text-gray-900">{submission.notes}</dd>
                  </div>
                )}
                {submission.order && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Delivery Address
                    </dt>
                    <dd className="text-gray-900">
                      {submission.order.deliveryAddress}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Items</h2>
              <div className="space-y-4">
                {submission.items.map((item) => (
                  <div
                    key={item.catalogItemId}
                    className="flex items-center gap-4 p-4 border rounded"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded">
                      {item.catalogItem.images[0] && (
                        <img
                          src={item.catalogItem.images[0]}
                          alt={item.catalogItem.name}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {item.catalogItem.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.catalogItem.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold">{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Submission Info</h2>
              <dl className="space-y-3 mb-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">ID</dt>
                  <dd className="text-sm font-mono text-gray-900">
                    {submission.id}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        submission.type === 'ORDER'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {submission.type}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Created At
                  </dt>
                  <dd className="text-gray-900">
                    {new Date(submission.createdAt).toLocaleString()}
                  </dd>
                </div>
              </dl>

              {submission.type === 'ORDER' && submission.order && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Update Status</h3>
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as OrderStatus)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                  >
                    <option value="PLACED">Placed</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={
                      updating || selectedStatus === submission.order.orderStatus
                    }
                    className="w-full"
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}