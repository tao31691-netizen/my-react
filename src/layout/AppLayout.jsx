import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "@/utils/auth";
import { Button, Layout, Menu, Tabs, message } from "antd";

const { Header, Sider, Content } = Layout;

export default function AppLayout({ routes, getLabel }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname || "/";

  const routeMap = useMemo(() => {
    const map = new Map();
    for (const r of routes) map.set(r.path, r);
    return map;
  }, [routes]);

  const [tabs, setTabs] = useState(() => {
    const initial = routeMap.has(pathname) ? pathname : "/";
    return [{ key: initial, label: getLabel(initial) }];
  });

  const tabsRef = useRef(tabs);
  useEffect(() => {
    tabsRef.current = tabs;
  }, [tabs]);

  // Auto-add a tab when route changes
  useEffect(() => {
    const key = routeMap.has(pathname) ? pathname : "/";
    setTabs((prev) => {
      if (prev.some((t) => t.key === key)) return prev;
      return [...prev, { key, label: getLabel(key) }];
    });
  }, [pathname, routeMap, getLabel]);

  const menuItems = useMemo(() => {
    return routes
      .filter((r) => !r.hideInMenu)
      .map((r) => ({ key: r.path, label: getLabel(r.path) }));
  }, [routes, getLabel]);

  const activeKey = routeMap.has(pathname) ? pathname : "/";

  const onTabChange = (key) => {
    navigate(key);
  };

  const onTabEdit = (targetKey) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.key !== targetKey);
      // If closing current tab, move to last tab (or Home fallback)
      if (targetKey === activeKey) {
        const fallbackKey = next.length ? next[next.length - 1].key : "/";
        // navigate after state update to avoid stale activeKey
        queueMicrotask(() => navigate(fallbackKey));
      }
      return next.length ? next : [{ key: "/", label: getLabel("/") }];
    });
  };

  const currentRoute = routeMap.get(activeKey);

  const onLogout = async () => {
    try {
      await signOut();
      message.success("已退出登录");
      window.location.replace("/login");
    } catch (err) {
      console.error(err);
      message.error(err?.message || "退出失败");
    }
  };

  const keepAliveKeys = useMemo(() => {
    return routes.filter((r) => r.keepAlive).map((r) => r.path);
  }, [routes]);

  return (
    <Layout style={{ minHeight: "100svh" }}>
      <Sider width={220} theme="light">
        <div style={{ padding: 16, fontWeight: 600 }}>梁晓颖财务系统</div>
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={[activeKey]}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <Tabs
            type="editable-card"
            hideAdd
            items={tabs}
            activeKey={activeKey}
            onChange={onTabChange}
            onEdit={(key, action) => {
              if (action === "remove") onTabEdit(key);
            }}
          />
          </div>
          <div style={{ paddingRight: 12 }}>
            <Button onClick={onLogout}>退出登录</Button>
          </div>
        </Header>

        <Content style={{ padding: 16 }}>
          {/*
            keepAlive=true 的路由：用“挂载后隐藏/显示”的方式保留组件实例与内部状态
            keepAlive=false 的路由：沿用原逻辑，只渲染当前路由
          */}
          <Suspense fallback={<div>Loading...</div>}>
            {/*
              keepAlive=true 的路由：用“挂载后隐藏/显示”的方式保留组件实例与内部状态
              注意：页面渲染改为 <Outlet />（由 React Router 渲染子路由）。
            */}
            {tabs
              .filter((t) => keepAliveKeys.includes(t.key))
              .map((t) => (
                <div
                  key={t.key}
                  style={{ display: t.key === activeKey ? "block" : "none" }}
                >
                  {t.key === activeKey ? <Outlet /> : null}
                </div>
              ))}

            {/*
              keepAlive=false 的路由：直接渲染当前子路由
              (activeKey 为 keepAlive 时，上面已经负责渲染)
            */}
            {!keepAliveKeys.includes(activeKey) ? <Outlet /> : null}
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}
