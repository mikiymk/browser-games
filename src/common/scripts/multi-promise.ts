export class MultiPromise<T> {
  readonly #executor: (resolve: (value: PromiseLike<T> | T) => void, reject: (reason?: unknown) => void) => void;

  constructor(executor: (resolve: (value: PromiseLike<T> | T) => void, reject: (reason?: unknown) => void) => void) {
    this.#executor = executor;
  }

  static withResolvers<T>(): {
    promise: MultiPromise<T>;
    reject: (reason?: unknown) => void;
    resolve: (value: PromiseLike<T> | T) => void;
  } {
    let resolve: ((value: PromiseLike<T> | T) => void) | undefined;
    let reject: ((reason?: unknown) => void) | undefined;
    const promise = new MultiPromise<T>((rs, rj) => {
      resolve = rs;
      reject = rj;
    });

    return {
      promise,
      reject: (reason?: unknown) => reject?.(reason),
      resolve: (value: PromiseLike<T> | T) => resolve?.(value),
    };
  }

  request(): Promise<T> {
    return new Promise(this.#executor);
  }
}
