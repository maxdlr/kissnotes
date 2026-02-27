import useSWR, { type SWRResponse } from "swr";
import swrFetcher from "@/services/swrFetcher";

const useBrowse = <T>(entity: string, params?: unknown): SWRResponse<T> => {
  const url = `/${entity}/browse`;
  return useSWR<T>(params ? [url, params] : url, swrFetcher);
};

export default useBrowse;
