import { getAccessToken, clearAccessToken } from "./token";

export async function request(input, init = {}) {
  const headers = new Headers(init.headers || {});
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });

  if (res.status === 401 || res.status === 403) {
    clearAccessToken();
    // hard redirect to ensure protected UI is gone
    window.location.replace("/login");
    throw new Error("Unauthorized");
  }

  return res;
}
