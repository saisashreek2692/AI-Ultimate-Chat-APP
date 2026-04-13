import { createBrowserRouter } from "react-router";
import Landing from "./Landing";
import Auth from "./components/Auth/Auth";
import DashboardLayout from "./Layout/DashboardLayout";
import Dashboard from "./Pages/Dashboard";
import MainLayout from "./Layout/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth",
    element: (
      <DashboardLayout>
        <Auth />
      </DashboardLayout>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    )
  },
  {
    path: "/main",
    element: (
      <MainLayout></MainLayout>
    )
  }
]);

export default router;
