import type { KissApiError, Model } from "@kissnotes/types";
import type { AxiosError } from "axios";
import axios from "@/services/axios";

export const onError = (err: AxiosError) => err?.response?.data as KissApiError;

const fetcher = async ({ url, params }: { url: string; params: Model }) => {
  try {
    if (!url) return null;
    const res = await axios.get(url, { params });
    return res?.data;
  } catch (error) {
    const kissError: KissApiError = (error as AxiosError)?.response
      ?.data as KissApiError;
    if (process.env.NODE_ENV === "development") {
      console.log({
        "----- kissError -----": `${kissError?.status} - ${kissError?.message}`,
      });
    }
    throw kissError;
  }
};

export default fetcher;
