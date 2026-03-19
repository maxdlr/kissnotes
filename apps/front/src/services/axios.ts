import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;

const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_COUNT_KEY = "auth_refresh_count";

const getRefreshCount = () =>
  parseInt(sessionStorage.getItem(REFRESH_COUNT_KEY) ?? "0", 10);
const incrementRefreshCount = () =>
  sessionStorage.setItem(REFRESH_COUNT_KEY, String(getRefreshCount() + 1));
const resetRefreshCount = () => sessionStorage.removeItem(REFRESH_COUNT_KEY);

const instance = axios.create({
  withCredentials: true,
  baseURL,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return response;
    }
    return { ...response, data: { data: response.data } };
  },
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (status === 404) return Promise.resolve(undefined);

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing && getRefreshCount() < MAX_REFRESH_ATTEMPTS) {
        isRefreshing = true;
        incrementRefreshCount();
        try {
          await instance.post("/refresh");
          isRefreshing = false;
          resetRefreshCount();
          return instance(originalRequest);
        } catch {
          isRefreshing = false;
          const isPrivate = ["/me"].includes(window.location.pathname);
          if (isPrivate) window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
