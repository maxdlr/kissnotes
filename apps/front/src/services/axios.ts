import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
let isRefreshing = false;

const instance = axios.create({
  withCredentials: true, // required — sends the signed auth cookie on every request
  baseURL,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Attach CSRF token if your backend requires it (e.g. a custom header)
    // const csrf = getCsrfToken();
    // if (csrf) config.headers["x-csrf-token"] = csrf;
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Normalise all responses so callers always read `response.data.data`
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

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await instance.post("/refresh"); // hits the new route
          isRefreshing = false;
          return instance(originalRequest); // retry the original request
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
