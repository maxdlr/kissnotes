"use client"; // Error boundaries must be Client Components
import { useEffect } from "react";

import { Button } from "@/components/Button";

export default function ErrorBoundary({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button
        onClick={
          // Attempt to recover by re-fetching and re-rendering the segment
          () => unstable_retry()
        }
        label="Try again"
      />
    </div>
  );
}
