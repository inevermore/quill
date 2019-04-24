import Delta from 'quill-delta';
import Emitter from '../core/emitter';
import Module from '../core/module';
import ajax from '../utils/ajax';
import icons from '../ui/icons';

const UPLOAD_ERROR_TEXT = '上传错误';

class Uploader extends Module {
  constructor(quill, options) {
    super(quill, options);
    quill.root.addEventListener('drop', e => {
      e.preventDefault();
      let native;
      if (document.caretRangeFromPoint) {
        native = document.caretRangeFromPoint(e.clientX, e.clientY);
      } else if (document.caretPositionFromPoint) {
        const position = document.caretPositionFromPoint(e.clientX, e.clientY);
        native = document.createRange();
        native.setStart(position.offsetNode, position.offset);
        native.setEnd(position.offsetNode, position.offset);
      } else {
        return;
      }
      const normalized = quill.selection.normalizeNative(native);
      const range = quill.selection.normalizedToRange(normalized);
      this.upload(range, e.dataTransfer.files);
    });
  }

  async upload(range, files) {
    const uploads = [];
    Array.from(files).forEach(file => {
      if (file && this.options.mimetypes.includes(file.type)) {
        uploads.push(file);
      }
    });
    if (uploads.length > 0) {
      let promises = [];
      if (this.options.url) {
        promises = this.uploadImage(uploads);
      } else {
        promises = this.options.handler.call(this, uploads);
      }
      try {
        const images = await Promise.all(promises);
        const update = images.reduce((delta, image) => {
          if (image) {
            return delta.insert({ image });
          }
          return delta;
        }, new Delta().retain(range.index).delete(range.length));
        this.quill.updateContents(update, Emitter.sources.USER);
        this.quill.setSelection(
          range.index + images.length,
          Emitter.sources.SILENT,
        );
      } catch (e) {
        showErrorTips(this.quill.container);
      }
    }
  }

  uploadImage(uploads) {
    return uploads.map(async file => {
      if (file.size / 1024 > this.options.maxSize) {
        alert(`图片大小不能超过${this.options.maxSize}K`); // eslint-disable-line no-alert
        return false;
      }
      const fd = new FormData();
      fd.append(
        this.options.param,
        file,
        file.name || `blob.${file.type.substr('image/'.length)}`,
      );
      fd.append('type', 'ajax');
      return new Promise(async (resolve, reject) => {
        try {
          const response = await ajax({
            url: this.options.url,
            method: 'post',
            data: fd,
          });
          let image = '';
          // eslint-disable-next-line no-restricted-syntax
          for (const item of this.options.response) {
            if (response[item]) {
              image = response[item];
            }
          }
          resolve(image);
        } catch (e) {
          reject();
        }
      });
    });
  }
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
Uploader.DEFAULTS = {
  mimetypes: ['image/png', 'image/jpg', 'image/jpeg'],
  url: '',
  method: '',
  maxSize: '',
  response: [],
  handler(files) {
    return files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
          resolve(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    });
  },
};

export default Uploader;
