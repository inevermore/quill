function debounce(fn, delay = 100) {
  let timer = null;
  return function(...rest) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn.apply(this, rest);
    }, delay);
  };
}

export default debounce;
