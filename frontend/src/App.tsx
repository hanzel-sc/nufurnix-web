import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './admin/auth/AuthContext';
import { ProtectedRoute } from './admin/auth/ProtectedRoute';
import CatalogPage from './users/pages/CataloguePage';
import ProductDetailPage from './users/pages/ProductDetailPage';
import CartPage from './users/pages/CartPage';
import SubmissionConfirmationPage from './users/pages/SubmissionConfirmationPage';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import CatalogManagementPage from './admin/pages/CatalogueManagementPage';
import SubmissionsListPage from './admin/pages/SubmissionsListPage';
import SubmissionDetailPage from './admin/pages/SubmissionDetailPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/confirmation/:submissionId" element={<SubmissionConfirmationPage />} />

          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/catalog"
            element={
              <ProtectedRoute>
                <CatalogManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <ProtectedRoute>
                <SubmissionsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/submissions/:id"
            element={
              <ProtectedRoute>
                <SubmissionDetailPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;