import { routeConfig } from "./routeConfig";
import { routeElements } from "./elements.jsx";

export function getLabel(path) {
  const found = routeConfig.find((r) => r.path === path);
  if (found?.title) return found.title;
  return path;
}

export function getLayoutRoutes() {
  return routeConfig
    .filter((r) => !r.public)
    .map((r) => ({
      path: r.path,
      element: routeElements[r.path],
      keepAlive: Boolean(r.keepAlive),
      hideInMenu: Boolean(r.hideInMenu),
    }));
}

export function getPublicRoutes() {
  return routeConfig
    .filter((r) => r.public)
    .map((r) => ({
      path: r.path,
      element: routeElements[r.path],
    }));
}
