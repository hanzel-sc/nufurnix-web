import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./admin/auth/AuthContext";
import { ProtectedRoute } from "./admin/auth/ProtectedRoute";

import CatalogPage from "./users/pages/CataloguePage";
import ProductDetailPage from "./users/pages/ProductDetailPage";
import CartPage from "./users/pages/CartPage";
import SubmissionConfirmationPage from "./users/pages/SubmissionConfirmationPage";

import LoginPage from "./admin/pages/LoginPage";
import DashboardPage from "./admin/pages/DashboardPage";
import CatalogManagementPage from "./admin/pages/CatalogueManagementPage";
import SubmissionsListPage from "./admin/pages/SubmissionsListPage";
import SubmissionDetailPage from "./admin/pages/SubmissionDetailPage";

const router = createBrowserRouter([
  { path: "/", element: <CatalogPage /> },
  { path: "/product/:id", element: <ProductDetailPage /> },
  { path: "/cart", element: <CartPage /> },
  {
    path: "/confirmation/:submissionId",
    element: <SubmissionConfirmationPage />,
  },

  { path: "/admin/login", element: <LoginPage /> },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/catalog",
    element: (
      <ProtectedRoute>
        <CatalogManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/submissions",
    element: (
      <ProtectedRoute>
        <SubmissionsListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/submissions/:id",
    element: (
      <ProtectedRoute>
        <SubmissionDetailPage />
      </ProtectedRoute>
    ),
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
