
// From here:
// https://fettblog.eu/typescript-union-to-intersection/
type UnionToIntersection<T> =
  (T extends any ? (x: T) => any : never) extends
  (x: infer R) => any ? R : never;

/**
 * Generates a type which provides a highly specific addEventListener/removeEventListener. This is
 * required due to TS' resolution rules which place string literals first.
 */
type ExpandEventsInternal<K extends keyof T, T, This> = K extends string ? {
  addEventListener(
    type: K,
    listener: (this: EventTarget, ev: T[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: K,
    listener: (this: EventTarget, ev: T[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
} : never;

/**
 * This expands the events specified in the template type map.
 */
type ExpandEvents<T, This> = UnionToIntersection<ExpandEventsInternal<keyof T, T, This>>;

/**
 * Creates a constructor which includes expanded events as well as the original type.
 */
export type AddEvents<
  X extends abstract new (...args: any[]) => InstanceType<X> extends EventTarget ? any : never,
  T,
  > = (new (...args: ConstructorParameters<X>) => (ExpandEvents<T, X> & InstanceType<X>));
