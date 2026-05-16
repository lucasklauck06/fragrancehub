import { createBrowserRouter } from "react-router";
import DefaultLayout from "./components/DefaultLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPerfumesPage from "./pages/admin/AdminPerfumesPage";
import AdminPerfumeFormPage from "./pages/admin/AdminPerfumeFormPage";
import AdminPermissionsPage from "./pages/admin/AdminPermissionsPage";
import ProtectedRoute from "./components/ProtectedRoute";



export const router = createBrowserRouter([
    {
        path: "/",
        Component: DefaultLayout,
        children: [
            {
                path: "/",
                Component: HomePage,
            },

        ]
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
                path: "permissoes",
                Component: AdminPermissionsPage,
            },
        ]
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
