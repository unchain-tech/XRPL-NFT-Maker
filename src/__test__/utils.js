export class DeferredPromise {
  resolveFn;
  rejectFn;
  promise;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolveFn = resolve;
      this.rejectFn = reject;
    });
  }

  resolve(arg) {
    this.resolveFn(arg);
    return this.promise;
  }

  reject(arg) {
    this.rejectFn(arg);
    return this.promise;
  }
}
