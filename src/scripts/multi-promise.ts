export class MultiPromise<T> {
  readonly #executor: (resolve: (value: PromiseLike<T> | T) => void, reject: (reason?: unknown) => void) => void;

  constructor(executor: (resolve: (value: PromiseLike<T> | T) => void, reject: (reason?: unknown) => void) => void) {
    this.#executor = executor;
  }

  request(): Promise<T> {
    return new Promise(this.#executor);
  }
}
