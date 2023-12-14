import { RequestData, ResponseData } from './types';

let port1: MessagePort;

onmessage = (e) => {
  if (e.data === 'connect') {
    port1 = e.ports[0];
    port1.onmessage = (ev: MessageEvent<RequestData>) => {
      // console.log(ev.data);
      const { id, action, payload } = ev.data;
      let data: any | undefined;
      let error: any | undefined;
      if (action === 'sleep') {
        console.log('sleep...');
        sleep.apply(null, payload);
        console.log('done.');
      } else {
        error = 'invalid action: ' + action;
      }
      const res: ResponseData = { id, data, error };
      port1.postMessage(res);
    };
    console.log('worker connected.');
  }
};

function sleep(ms: number) {
  const start = performance.now();
  while (performance.now() - start < ms) {}
}
