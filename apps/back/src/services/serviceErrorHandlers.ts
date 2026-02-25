import { NextFunction, Request, Response } from "express";

type HandledError = Error | TApiError | TCrudError;

const serviceErrorHandler = (
  err: HandledError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Log the error
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  // Send JSON response
  return ApiResponse(res, {
    status: (err as any)?.status || 500,
    message: err?.message || "Something went wrong",
    error: {
      endpoint: req.originalUrl,
      stack:
        process.env.NODE_ENV !== "production"
          ? process.env.LOG_LEVEL === "debug"
            ? err?.stack
            : undefined
          : undefined,
      traceId: req.headers["x-request-id"] || null,
    },
  });
};

export default serviceErrorHandler;
