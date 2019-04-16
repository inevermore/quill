export default function(options) {
  const { url, method = 'get', data = {}, timeout = 3000 } = options;
  return new Promise((resolve, reject) => {
    /* 创建Ajax并提交 */
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);
    xhr.responseType = 'json';
    xhr.timeout = timeout;
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.addEventListener('load', e => {
      try {
        const json = e.target.response;
        if (json.state === 'SUCCESS') {
          resolve(json);
        } else {
          reject();
        }
      } catch (er) {
        reject();
      }
    });
    xhr.ontimeout = function() {
      reject();
      // XMLHttpRequest 超时。在此做某事。
    };
    xhr.send(data);
  });
}
