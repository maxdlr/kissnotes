import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  // withCredentials: true,
  baseURL,
});

instance.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return response;
    }
    // Otherwise, wrap the data so frontend always uses response.data.data
    return { ...response, data: { data: response.data } };
  },
  async (error) => {
    console.log({ baseURL });
    const status = error?.response?.status;

    if (status === 404) {
      // window.location.href = "/not-found";
      return;
    }

    const pathname = location.pathname;

    const isPublicPage = pathname.includes("/me");

    if (status === 401 && !isPublicPage) {
      window.location.href = `/`;
    }

    return Promise.reject(error);
  },
);

export default instance;

// async function refreshTokenOnce(baseURL) {
//   if (!refreshPromise) {
//     const refreshUrl = `${baseURL}auth/v2/token/refresh`;
//
//     refreshPromise = axios
//       .get(refreshUrl, { withCredentials: true })
//       .finally(() => {
//         refreshPromise = null;
//       });
//   }
//
//   return refreshPromise;
// }
