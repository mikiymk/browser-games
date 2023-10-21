export class MultiPromise<T> {
  #executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => void;

  constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => void) {
    this.#executor = executor;
  }

  request(): Promise<T> {
    return new Promise(this.#executor);
  }
}
