export class MultiPromise<T> {
  readonly #executor: (resolve: (value: PromiseLike<T> | T) => void, reject: (reason?: unknown) => void) => void;

  constructor(executor: (resolve: (value: PromiseLike<T> | T) => void, reject: (reason?: unknown) => void) => void) {
    this.#executor = executor;
  }

  request(): Promise<T> {
    return new Promise(this.#executor);
  }

  static withResolvers<T>(): {
    resolve: (value: PromiseLike<T> | T) => void;
    reject: (reason?: unknown) => void;
    promise: MultiPromise<T>;
  } {
    let resolve: ((value: PromiseLike<T> | T) => void) | undefined;
    let reject: ((reason?: unknown) => void) | undefined;
    const promise = new MultiPromise<T>((rs, rj) => {
      resolve = rs;
      reject = rj;
    });

    return {
      resolve: (value: PromiseLike<T> | T) => resolve?.(value),
      reject: (reason?: unknown) => reject?.(reason),
      promise,
    };
  }
}
