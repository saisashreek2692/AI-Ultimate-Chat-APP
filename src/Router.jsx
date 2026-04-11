import { createBrowserRouter } from "react-router";
import Landing from "./Landing";
import Auth from "./components/Auth/Auth";
import DashboardLayout from "./Layout/DashboardLayout";
import Dashboard from "./Pages/Dashboard";

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
  }
]);

export default router;
