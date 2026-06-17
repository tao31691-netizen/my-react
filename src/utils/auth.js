import { cloudbase } from "./cloudbase";
import { clearAccessToken, getAccessToken } from "./token";

export async function isLoggedIn() {
  // Session-only persistence (survives refresh, clears on tab close)
  return Boolean(getAccessToken());
}

function clearAuthStorage(extraKeys = []) {
  const shouldDelete = (key) => {
    const raw = String(key || "");
    const k = raw.toLowerCase();

    if (extraKeys.includes(raw)) return true;

    return (
      k.startsWith("user_info_") ||
      k.includes("tcb") ||
      k.includes("cloudbase") ||
      k.includes("token") ||
      k.includes("auth")
    );
  };

  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (shouldDelete(key)) localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }

}

export async function signOut() {
  const auth = cloudbase.auth();

  // Best-effort: CloudBase login state may persist even after signOut.
  let state;
  try {
    state = await auth.getLoginState();
  } catch {
    state = null;
  }

  await auth.signOut();

  clearAccessToken();

  const extraKeys = [];
  if (state?.userInfoKey) extraKeys.push(state.userInfoKey);

  clearAuthStorage(extraKeys);
}
