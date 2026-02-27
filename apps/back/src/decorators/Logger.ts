export function Logger<T extends (...args: any[]) => any>(
  fn: T,
  withArgs: boolean = false,
): (...args: Parameters<T>) => ReturnType<T> | Promise<ReturnType<T>> {
  const name = fn.name || "anonymous";

  return function (...args: Parameters<T>) {
    if (withArgs) {
      console.log(`[LOG] Entering ${name} with arguments:`, args);
    } else {
      console.log(`[LOG] Entering ${name}`);
    }

    const result = fn(...args);

    if (result instanceof Promise) {
      return result.then((res) => {
        if (withArgs) {
          console.log(`[LOG] Exiting ${name} with result:`, res);
        } else {
          console.log(`[LOG] Exiting ${name}`);
        }
        return res;
      });
    }

    if (withArgs) {
      console.log(`[LOG] Exiting ${name} with result:`, result);
    } else {
      console.log(`[LOG] Exiting ${name}`);
    }

    return result;
  };
}
