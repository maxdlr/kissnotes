export function TryCatch<T extends (...args: any[]) => any>(
  fn: T,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async function (...args: Parameters<T>) {
    try {
      return await fn(...args);
    } catch (error: any) {
      throw error;
    }
  };
}
