import { createBrowserRouter } from "react-router";
import DefaultLayout from "./components/DefaultLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PerfumistasHomePage from "./pages/PerfumistasHomePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPerfumesPage from "./pages/admin/AdminPerfumesPage";
import AdminPerfumeFormPage from "./pages/admin/AdminPerfumeFormPage";
import AdminPermissionsPage from "./pages/admin/AdminPermissionsPage";
import AdminBrandsPage from "./pages/admin/AdminBrandsPage";
import AdminBrandFormPage from "./pages/admin/AdminBrandFormPage";
import BrandDetailPage from "./pages/MarcasDetailPage";
import BuscaMarcasPage from "./pages/BuscaMarcasPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PerfumistPage from "./pages/PerfumistPage";
import AdminPerfumistsPage from "./pages/admin/AdminPerfumistsPage";
import AdminPerfumistFormPage from "./pages/admin/AdminPerfumistFormPage";
import PerfumeDetailPage from "./pages/PerfumeDetailPage";
import BuscaPerfumesPage from "./pages/BuscaPerfumesPage";
import ReviewPage from "./pages/ReviewPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DefaultLayout,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "/perfumistas",
        Component: PerfumistasHomePage,
      },
      {
        path: "/perfumista/:id",
        Component: PerfumistPage,
      },
      {
        path: "/marcas",
        Component: BuscaMarcasPage,
      },
      {
        path: "/marca/:id",
        Component: BrandDetailPage,
      },
      {
        path: "/busca",
        Component: BuscaPerfumesPage,
      },
      {
        path: "/perfume/:id",
        Component: PerfumeDetailPage,
      },
      {
        path: "/resenhas",
        Component: ReviewPage,
      },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/admin",
    element: <ProtectedRoute adminOnly={true} />,
    children: [
      {
        path: "",
        Component: AdminDashboardPage,
      },
      {
        path: "perfumes",
        Component: AdminPerfumesPage,
      },
      {
        path: "perfumes/:id",
        Component: AdminPerfumeFormPage,
      },
      {
        path: "marcas",
        Component: AdminBrandsPage,
      },
      {
        path: "marcas/:id",
        Component: AdminBrandFormPage,
      },
      {
        path: "perfumistas",
        Component: AdminPerfumistsPage,
      },
      {
        path: "perfumistas/:id",
        Component: AdminPerfumistFormPage,
      },
      {
        path: "permissoes",
        Component: AdminPermissionsPage,
      },
    ],
  },
  {
    path: "*",
    Component: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-gray-600">Página não encontrada</p>
        </div>
      </div>
    ),
  },
]);