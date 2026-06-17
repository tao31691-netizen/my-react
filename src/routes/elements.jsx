import { lazy } from "react";

const Home = lazy(() => import("@/pages/Home.jsx"));
const About = lazy(() => import("@/pages/About.jsx"));
const Login = lazy(() => import("@/pages/Login.jsx"));

export const routeElements = {
  "/": <Home />,
  "/about": <About />,
  "/login": <Login />,
};
