import { Response } from "express";

/**
 * Registers global helper functions for error handling across the API.
 *
 * @function registerGlobals
 * @returns {void} No return value; side-effect is attaching error shortcuts to `global`.
 */
const registerGlobalErrors = (): void => {
  global.ApiError = (statusOrMessage: number | string, message?: string) => {
    const hasStatus = typeof statusOrMessage === "number";
    const error = new Error(hasStatus ? message : statusOrMessage) as TApiError;
    error.status = hasStatus ? statusOrMessage : 400;
    return error;
  };

  global.CrudError = (statusOrMessage: number | string, message?: string) => {
    const hasStatus = typeof statusOrMessage === "number";
    const error = new Error(
      hasStatus ? message : statusOrMessage,
    ) as TCrudError;
    error.status = hasStatus ? statusOrMessage : 400;
    return error;
  };

  global.Unauthorized = (
    type: "user" | "person" | "yousign" | "ext" = "user",
  ) => ApiError(401, `${type} authentication required`);

  global.Forbidden = () => ApiError(403);

  global.isApiError = (error: any): error is TApiError =>
    error &&
    error instanceof Error &&
    typeof (error as any).status === "number";
};

const registerGlobalResponses = (): void => {
  global.ApiResponse = (
    res: Response,
    apiResponse: TApiResponse,
  ): Response<any, Record<string, any>> => {
    return res.status(apiResponse.status).send(apiResponse);
  };
};

const registerGlobals = () => {
  registerGlobalErrors();
  registerGlobalResponses();
};

export default registerGlobals;
