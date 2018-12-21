declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor();
  }

  // @ts-ignore valid according to integration instructions: https://github.com/webpack-contrib/worker-loader#integrating-with-typescript
  export = WebpackWorker;
}
