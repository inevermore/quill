import Delta from 'quill-delta';
import Emitter from '../core/emitter';
import icons from '../ui/icons';

const UPLOAD_ERROR_TEXT = '上传错误';
const host = /localhost|127\.0\.0\.1/.test(window.location.host)
  ? 'http://test152.suanshubang.com'
  : '';
const url = `${host}/zbtiku/tiku/imgupload?action=uploadimage`;
function upload(file) {
  if (file.size / 1024 > 600) {
    alert('图片大小不能超过600K'); // eslint-disable-line no-alert
    return false;
  }
  return new Promise((resolve, reject) => {
    /* 创建Ajax并提交 */
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    fd.append(
      'upfile',
      file,
      file.name || `blob.${file.type.substr('image/'.length)}`,
    );
    fd.append('type', 'ajax');
    xhr.open('post', url, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    const errorTimerId = setTimeout(() => {
      reject();
    }, 3000);
    xhr.addEventListener('load', e => {
      try {
        const json = e.target.response;
        if (json.state === 'SUCCESS' && json.url) {
          resolve(json.url);
          clearTimeout(errorTimerId);
        } else {
          reject();
        }
      } catch (er) {
        reject();
      }
    });
    xhr.send(fd);
  });
}

function uploadImage(range, files) {
  const promises = files.map(file => {
    return upload(file);
  });
  Promise.all(promises).then(
    images => {
      const update = images.reduce((delta, image) => {
        return delta.insert({ image });
      }, new Delta().retain(range.index).delete(range.length));
      this.quill.updateContents(update, Emitter.sources.USER);
      this.quill.setSelection(
        range.index + images.length,
        Emitter.sources.SILENT,
      );
    },
    () => {
      showErrorTips(this.quill.container);
    },
  );
}

const tips = createErrorTips(UPLOAD_ERROR_TEXT);
function showErrorTips(container) {
  tips.style.display = 'block';
  if (!container.contains(tips)) {
    container.appendChild(tips);
  }
  setTimeout(() => {
    tips.style.display = 'none';
  }, 3000);
}

function createErrorTips(text) {
  const div = document.createElement('div');
  div.className = 'tk-upload-error-tips';
  const span = document.createElement('span');
  span.innerText = text;
  const closeButton = document.createElement('button');
  closeButton.innerHTML = icons.close;
  div.appendChild(span);
  div.appendChild(closeButton);
  closeButton.addEventListener('click', () => {
    div.style.display = 'none';
  });
  return div;
}

export default uploadImage;
