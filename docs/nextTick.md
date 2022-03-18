# nextTick
vue 是如何做到批量更新的，很简单，将组件的更新函数放到成功的Promise 的then中执行，这样它就是一个微任务，
在当前宏任务执行完才会去执行，所以不会导致频繁更新

```js
const queue: any[] = [];

const p = Promise.resolve();
let isFlushPending = false;

export function nextTick(fn) {
  return fn ? p.then(fn) : p;
}

export function queueJobs(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }

  queueFlush();
}
function queueFlush() {
  if (isFlushPending) return;
  isFlushPending = true;

  nextTick(flushJobs);
}

function flushJobs() {
  isFlushPending = false;
  let job;
  while ((job = queue.shift())) {
    job && job();
  }
}
```
我们在组件更新的时候将组件的update函数通过queueJobs加入到queue中，然后直接queueFlush执行队列
这里有一个全局的变量isFlushPending初始值为false，改为true 来表示正在执行异步任务队列（其实还是等到宏任务执行完执行）
这样就保证在一个Tick中(宏任务中)就不会频繁的执行了，巧妙在貌似立刻执行了更新，但其实是异步的，我们依然能像queue中加入新的不重复的更新函数

