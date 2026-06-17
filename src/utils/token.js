const ACCESS_TOKEN_KEY = "cb_access_token";

export function setAccessToken(token) {
  try {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function getAccessToken() {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearAccessToken() {
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // ignore
  }
}
