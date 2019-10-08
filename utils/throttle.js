function throttle(fn, interval = 300) {
  let canRun = true;
  return function(...rest) {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this, rest);
      canRun = true;
    }, interval);
  };
}

export default throttle;
