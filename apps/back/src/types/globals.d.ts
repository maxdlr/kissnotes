import { Response } from "express";

export {};

declare global {
  interface TApiError extends Error {
    status: number;
  }

  interface TCrudError extends Error {
    status: number;
  }

  interface TApiResponse {
    status: number;
    message: string;
    count?: number;
    error?: any;
    body?: any;
  }

  var ApiResponse: {
    (
      res: Response,
      apiResponse: TApiResponse,
    ): Response<any, Record<string, any>>;
  };

  var ApiError: {
    (status: number, message?: string): TApiError;
    (message: string): TApiError;
  };

  var CrudError: {
    (status: number, message?: string): TCrudError;
    (message: string): TCrudError;
  };

  var Unauthorized: (type?: "user" | "origin") => TApiError;
  var Forbidden: () => TApiError;
  var isApiError: (error: unknown) => error is TApiError;
  var isCrudError: (error: unknown) => error is TCrudError;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      LOG_LEVEL: "debug" | "info";
      PORT: number;
      SSL_CRT_FOLDER: string;
      CORS_ORIGIN_URL: string;
      JWT_REFRESH_SECRET: string;
      COOKIE_SECRET: string;
      JWT_SECRET: string;
      [key: string]: string;
    }
  }
}
