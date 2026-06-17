import { useMemo } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import AppLayout from "./layout/AppLayout.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";
import { getLabel, getLayoutRoutes, getPublicRoutes } from "./routes/buildRoutes";

export default function App() {
  const layoutRoutes = useMemo(() => getLayoutRoutes(), []);
  const publicRoutes = useMemo(() => getPublicRoutes(), []);

  const element = useRoutes([
    // public routes
    ...publicRoutes,

    // protected area
    {
      path: "/",
      element: (
        <RequireAuth>
          <AppLayout routes={layoutRoutes} getLabel={getLabel} />
        </RequireAuth>
      ),
      children: layoutRoutes.map((r) => ({
        path: r.path === "/" ? undefined : r.path.slice(1),
        index: r.path === "/" ? true : undefined,
        element: r.element,
      })),
    },

    // fallback
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return element;
}
