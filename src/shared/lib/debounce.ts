type GenericFunction = (...args: unknown[]) => void;

export interface DebouncedFunction<T extends GenericFunction> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

export function debounce<T extends GenericFunction>(
  fn: T,
  delay: number = 300,
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debouncedFn = (...args: Parameters<T>): void => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(...args);
      timer = undefined;
    }, delay);
  };

  debouncedFn.cancel = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debouncedFn;
}
