import { RequestData, ResponseData } from './types';
import MyWorker from './worker?worker';

const { port1, port2 } = new MessageChannel();
const worker: Worker = new MyWorker();
worker.postMessage('connect', [port1]);

port2.onmessage = (ev: MessageEvent<ResponseData>) => {
  const { id, error, data } = ev.data;
  const callback = callbacks.get(id)!;
  callback(error, data);
};

function showText(target: HTMLElement, text: string, time: number = 1000) {
  if (!target.hasAttribute('data-text')) {
    target.setAttribute('data-text', target.innerText);
  }
  target.innerText = text;
  target.style.setProperty('background-color', '#24d524');
  setTimeout(() => {
    target.innerText = target.getAttribute('data-text')!;
    target.style.removeProperty('background-color');
  }, time);
}

let taskId = 1;
function nextTaskId() {
  return taskId++;
}

const callbacks = new Map<number, (error: any, data: any) => void>();

function callInBack(action: string, payload: any, callback: (error: any, data: any) => void) {
  const id = nextTaskId();
  callbacks.set(id, callback);
  const data: RequestData = { id, action, payload };
  port2.postMessage(data);
}

document.getElementById('btn1')?.addEventListener('click', function (e) {
  console.log('btn1 clicked.');
  callInBack('sleep', [3000], () => {
    showText(e.target as HTMLElement, 'done');
  });
});
