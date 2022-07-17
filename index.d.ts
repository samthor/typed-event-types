
// From here:
// https://fettblog.eu/typescript-union-to-intersection/
type UnionToIntersection<T> =
  (T extends any ? (x: T) => any : never) extends
  (x: infer R) => any ? R : never;

/**
 * Generates a type which provides a highly specific addEventListener/removeEventListener. This is
 * required due to TS' resolution rules which place string literals first.
 */
type ExpandEventsInternal<K extends keyof T, T> = K extends string ? {
  addEventListener(
    type: K,
    listener: (this: HTMLElement, ev: T[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: K,
    listener: (this: HTMLElement, ev: T[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
} : never;

/**
 * This expands the events specified in the template type map.
 */
type ExpandEvents<T> = UnionToIntersection<ExpandEventsInternal<keyof T, T>>;

/**
 * Creates a constructor which includes expanded events as well as the original type.
 */
export type TypedEventConstructor<
  X extends abstract new (...args: any[]) => InstanceType<X> extends EventTarget ? any : never,
  T,
  > = (new (...args: ConstructorParameters<X>) => (ExpandEvents<T> & InstanceType<X>));
