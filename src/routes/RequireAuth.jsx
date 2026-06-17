import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "@/utils/auth";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const [authed, setAuthed] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const ok = await isLoggedIn();
      if (cancelled) return;
      setAuthed(ok);
    })();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (authed === null) return null;

  if (!authed) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname || "/" }}
      />
    );
  }

  return children;
}
