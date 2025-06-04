/**
 * 同じオブジェクトで複数回の非同期処理を行うためのクラス。
 */
export class MultiPromise<T> {
  readonly #executor: (resolve: (value: PromiseLike<T> | T) => void, reject: (reason?: unknown) => void) => void;

  constructor(executor: (resolve: (value: PromiseLike<T> | T) => void, reject: (reason?: unknown) => void) => void) {
    this.#executor = executor;
  }

  /**
   * 新しい`MultiPromise`インスタンスを作成し、`resolve` `reject`と共に返します。
   * @returns `resolve`と`reject`を含むオブジェクト
   */
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

  /**
   * 新しい非同期リクエストを作成し、結果を`Promise`で返します。
   * @returns リクエストの結果の`Promise`。
   */
  request(): Promise<T> {
    return new Promise(this.#executor);
  }
}
