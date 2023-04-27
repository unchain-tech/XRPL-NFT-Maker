const EventEmitter = require('events');

export class MockedXumm extends EventEmitter {
  async authorize() {
    this.user = {
      account: Promise.resolve('rAccount'),
    };
    this.emit('success');
  }

  payload = {
    createAndSubscribe: (_payload) => {
      const { DeferredPromise } = require('../utils');
      const { w3cwebsocket: WebSocket } = require('websocket');
      const callbackPromise = new DeferredPromise();
      const ws = new WebSocket('ws://localhost:3000');
      setTimeout(() => {
        ws.onmessage({ data: JSON.stringify({}) });
        setTimeout(() => {
          ws.onmessage({
            data: JSON.stringify({ signed: true, txid: 'txid' }),
          });
        }, 0);
      }, 0);
      return {
        // payload: {};
        resolved: callbackPromise.promise,
        resolve: (resolveData) => {
          callbackPromise.resolve(resolveData);
        },
        websocket: ws,
      };
    },
  };
}
