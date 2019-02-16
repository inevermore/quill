function throttle(fn, delay) {
  let lastTime = 0;

  // eslint-disable-next-line func-names
  return function(...rest) {
    const context = this;
    if (Date.now() - lastTime >= delay) {
      fn.apply(context, rest);
      lastTime = Date.now();
    }
  };
}

export default throttle;
