/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import type {
  KissResponseData,
  KissResponseError,
  KResData,
} from "@kissnotes/types";
import type { AxiosRequestConfig, AxiosResponseHeaders } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "@/services/axios";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

interface MakeRequestParams<TBody>
  extends Omit<AxiosRequestConfig, "url" | "method" | "data" | "signal"> {
  url: string;
  method: HttpMethod;
  data?: TBody;
}

interface SyncResult<TRes> {
  syncError: KissResponseError | undefined;
  syncData: KResData<TRes>;
  syncHeaders: AxiosResponseHeaders | null;
  syncLoading: boolean;
  statusCode: number | undefined;
}

const useAxios = (url: string) => {
  const abortController = useRef<AbortController | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<KResData<unknown>>();
  const [headers, setHeaders] = useState<AxiosResponseHeaders | null>(null);
  const [error, setError] = useState<KissResponseError | undefined>();
  const [errors, setErrors] = useState<string[]>([]);

  const makeAxiosRequest = async <TRes, TBody = undefined>({
    url,
    method,
    data,
    ...rest
  }: MakeRequestParams<TBody>): Promise<SyncResult<TRes>> => {
    abortController.current = new AbortController();

    let syncError: KissResponseError | undefined;
    let syncData: KResData<TRes>;
    let syncHeaders: AxiosResponseHeaders | null = null;
    let syncLoading = true;
    let statusCode: number | undefined;

    setError(undefined);
    setErrors([]);
    setLoading(true);

    try {
      const {
        data: resData,
        headers: resHeaders,
        status,
      } = await axios.request<KissResponseData<TRes>>({
        method,
        url,
        data,
        signal: abortController.current.signal,
        ...rest,
      });

      syncData = resData;
      syncHeaders = resHeaders as AxiosResponseHeaders;
      statusCode = status;

      setHeaders(syncHeaders);
      setResponseData(syncData);
    } catch (err: any) {
      if (err) {
        statusCode = err.response?.status;

        if (
          !abortController.current.signal.aborted &&
          err.code !== "ERR_CANCELED"
        ) {
          syncError =
            err.response?.data?.errors?.message ??
            err.response?.data?.errors ??
            undefined;

          setError(syncError);
          setErrors(err.response?.data?.errors?.fields ?? []);
        }
      }
    } finally {
      syncLoading = false;
      setLoading(false);
    }

    return { syncError, syncData, syncHeaders, syncLoading, statusCode };
  };

  const getData = useCallback(
    <TRes>(config?: Omit<AxiosRequestConfig, "url" | "method">) =>
      makeAxiosRequest<TRes, undefined>({ url, method: "get", ...config }),
    [url],
  );

  const postData = useCallback(
    <TRes, TBody>(
      data: TBody,
      config?: Omit<AxiosRequestConfig, "url" | "method" | "data">,
    ) =>
      makeAxiosRequest<TRes, TBody>({ url, method: "post", data, ...config }),
    [url],
  );

  const putData = useCallback(
    <TRes, TBody>(
      data: TBody,
      config?: Omit<AxiosRequestConfig, "url" | "method" | "data">,
    ) => makeAxiosRequest<TRes, TBody>({ url, method: "put", data, ...config }),
    [url],
  );

  const patchData = useCallback(
    <TRes, TBody>(
      data: TBody,
      config?: Omit<AxiosRequestConfig, "url" | "method" | "data">,
    ) =>
      makeAxiosRequest<TRes, TBody>({ url, method: "patch", data, ...config }),
    [url],
  );

  const deleteData = useCallback(
    <TRes>(config?: Omit<AxiosRequestConfig, "url" | "method">) =>
      makeAxiosRequest<TRes, undefined>({ url, method: "delete", ...config }),
    [url],
  );

  const getDataSyncByUrl = useCallback(
    <TRes>(url: string, config?: Omit<AxiosRequestConfig, "url" | "method">) =>
      makeAxiosRequest<TRes, undefined>({ url, method: "get", ...config }),
    [],
  );

  const overrideError = (error: KissResponseError | undefined) =>
    setError(error);

  useEffect(() => {
    return () => abortController.current?.abort();
  }, [url]);

  return {
    loading,
    data: responseData,
    error,
    errors,
    headers,
    overrideError,
    getData,
    getDataSyncByUrl,
    postData,
    putData,
    patchData,
    deleteData,
  };
};

export default useAxios;
