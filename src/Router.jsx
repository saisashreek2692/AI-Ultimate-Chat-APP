import { createBrowserRouter, redirect } from "react-router";
import Landing from "./Landing";
import Auth from "./components/Auth/Auth";
import DashboardLayout from "./Layout/DashboardLayout";
import Dashboard from "./Pages/Dashboard";
import MainLayout from "./Layout/MainLayout";
import { Brain, Dev, Writing, Office, Meetings, Workflow } from "./Pages/index";

import { store } from "./store";

//redirect user to /main if not authenticated
const requireAuth = () => {
  const { auth } = store.getState();
  if (!auth.user) return redirect("/main/brain");
  return null;
};

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
    ),
  },
  {
    path: "/main",
    loaders: requireAuth,
    element: <MainLayout />,
    children: [
      { path: "brain", loaders: requireAuth, element: <Brain /> },
      { path: "dev", loaders: requireAuth, element: <Dev /> },
      { path: "writing", loaders: requireAuth, element: <Writing /> },
      { path: "office", loaders: requireAuth, element: <Office /> },
      { path: "meetings", loaders: requireAuth, element: <Meetings /> },
      { path: "workflow", loaders: requireAuth, element: <Workflow /> },
    ],
  },

  // ── CATCH-ALL ───────────────────────────────────────────────
  {
    path: '*',
    loader: () => {
      const { auth } = store.getState();
      return redirect(auth.user ? '/main/brain' : '/');
    },
    element: null,
  },
]);

export default router;
