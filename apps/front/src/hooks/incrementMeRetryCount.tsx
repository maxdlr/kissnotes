"use client";
import { isClient, ME_RETRY_COUNT_KEY, getMeRetryCount } from "./AuthProvider";

export const incrementMeRetryCount = () =>
  isClient &&
  sessionStorage.setItem(ME_RETRY_COUNT_KEY, String(getMeRetryCount() + 1));
