export const routeConfig = [
  {
    path: "/",
    title: "Home",
    keepAlive: false,
    hideInMenu: false,
  },
  {
    path: "/about",
    title: "About",
    keepAlive: true,
    hideInMenu: false,
  },
  {
    path: "/login",
    title: "登录",
    keepAlive: false,
    hideInMenu: true,
    fullScreen: true,
    public: true,
  },
];
