const LOCAL_API_BASE_URL = "http://localhost:8071/api/v1/";
const PUBLIC_API_BASE_URL = "https://qsc-api.datahex.co/api/v1/";

const PRIVATE_HOST_PATTERN = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/;

const isLocalLikeHost = (hostname = "") => {
  const normalizedHost = hostname.toLowerCase().trim();

  return (
    normalizedHost === "localhost" ||
    normalizedHost === "0.0.0.0" ||
    normalizedHost.endsWith(".local") ||
    /^127(?:\.\d{1,3}){3}$/.test(normalizedHost) ||
    PRIVATE_HOST_PATTERN.test(normalizedHost)
  );
};

const ensureTrailingSlash = (value = "") => (value.endsWith("/") ? value : `${value}/`);

const normalizeConfiguredBaseUrl = (value = "") => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (trimmedValue.startsWith("/")) {
    return ensureTrailingSlash(trimmedValue);
  }

  try {
    return ensureTrailingSlash(new URL(trimmedValue).toString());
  } catch (_) {
    return "";
  }
};

const getDefaultApiBaseUrl = () => {
  if (typeof window !== "undefined" && isLocalLikeHost(window.location.hostname)) {
    return LOCAL_API_BASE_URL;
  }

  return PUBLIC_API_BASE_URL;
};

export const getApiBaseUrl = () => {
  const configuredBaseUrl = normalizeConfiguredBaseUrl(import.meta.env.VITE_API || "");
  const defaultBaseUrl = getDefaultApiBaseUrl();

  if (!configuredBaseUrl) {
    return defaultBaseUrl;
  }

  if (configuredBaseUrl.startsWith("/")) {
    return configuredBaseUrl;
  }

  if (typeof window === "undefined") {
    return configuredBaseUrl;
  }

  try {
    const frontendIsLocal = isLocalLikeHost(window.location.hostname);
    const apiHost = new URL(configuredBaseUrl).hostname;
    const apiIsLocal = isLocalLikeHost(apiHost);

    if (!frontendIsLocal && apiIsLocal) {
      return PUBLIC_API_BASE_URL;
    }

    return configuredBaseUrl;
  } catch (_) {
    return defaultBaseUrl;
  }
};

export const buildApiUrl = (path = "") => {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = String(path || "").replace(/^\/+/, "");

  if (!normalizedPath) {
    return baseUrl;
  }

  return `${baseUrl}${normalizedPath}`;
};