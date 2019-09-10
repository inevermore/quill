import Module from '../core/module';

class ImageResizer extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.imgNode = null;
    this.wrap = this.quill.container;
    this.resizer = this.createResizer();
    this.prePos = { x: 0, y: 0 };
    this.rect = [
      // [width, height]
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
    ];
    this.mouseMoveFrame = false;
    this.mouseMoveEvent = this.mouseMove.bind(this);
    this.wrap.addEventListener('click', e => {
      if (
        this.wrap.contains(e.target) &&
        e.target.tagName.toUpperCase() === 'IMG' &&
        !e.target.classList.contains(quill.formulaImgClass) &&
        (!this.imgNode || e.target !== this.imgNode)
      ) {
        this.addResizer(e.target);
      } else {
        this.hide();
      }
    });
    document.addEventListener('mouseup', () => {
      this.handId = -1;
      this.imgNode = null;
      this.wrap.removeEventListener('mousemove', this.mouseMoveEvent);
    });
    quill.root.addEventListener('keydown', () => {
      this.hide();
    });
  }

  addResizer(imgNode) {
    this.imgNode = imgNode;
    this.scale = this.imgNode.width / this.imgNode.height;
    this.showContainer(this.imgNode);
    this.resizer.addEventListener('mousedown', e => this.mouseDown(e));
  }

  mouseDown(e) {
    e.preventDefault();
    const hand = e.target;
    if (hand.className.indexOf('ql-image-resizer-hand') > -1) {
      this.prePos = {
        x: e.clientX,
        y: e.clientY,
      };
      this.originSize = {
        width: this.imgNode.offsetWidth,
        height: this.imgNode.offsetHeight,
      };
      this.handId = hand.className.slice(-1);
      this.wrap.addEventListener('mousemove', this.mouseMoveEvent);
    }
  }

  mouseMove(e) {
    if (this.mouseMoveFrame) return;

    this.mouseMoveFrame = true;
    requestAnimationFrame(() => {
      if (this.handId < 0 || !this.imgNode) return;

      this.mouseMoveFrame = false;
      const offset = {
        x: e.clientX - this.prePos.x,
        y: e.clientY - this.prePos.y,
      };
      const widthDir = this.rect[this.handId][0];
      const heightDir = this.rect[this.handId][1];
      let offsetWidth = widthDir * offset.x;
      let offsetHeight = heightDir * offset.y;
      // 比例缩放
      if (widthDir !== 0 && heightDir !== 0) {
        // 放大
        if (offsetHeight > 0 || offsetWidth > 0) {
          if (offsetHeight > 0 && offsetWidth > 0) {
            if (Math.abs(offset.x) / Math.abs(offset.y) > this.scale) {
              offsetHeight = offsetWidth / this.scale;
            } else {
              offsetWidth = offsetHeight * this.scale;
            }
          } else if (offsetWidth > 0) {
            offsetHeight = offsetWidth / this.scale;
          } else {
            offsetWidth = offsetHeight * this.scale;
          }
          // 缩小
        } else if (Math.abs(offset.x) / Math.abs(offset.y) > this.scale) {
          offsetWidth = offsetHeight * this.scale;
        } else {
          offsetHeight = offsetWidth / this.scale;
        }
      }
      const width = this.originSize.width + offsetWidth;
      const { paddingLeft, paddingRight } = getComputedStyle(this.quill.root);
      const contentWidth =
        this.quill.root.offsetWidth -
        parseInt(paddingLeft, 10) -
        parseInt(paddingRight, 10);
      if (width >= contentWidth && widthDir !== 0) {
        return;
      }
      this.resizeImage(width, this.originSize.height + offsetHeight);
    });
  }

  resizeImage(width, height) {
    this.imgNode.width = width;
    this.imgNode.height = height;
    this.updateImageStyle();
  }

  updateImageStyle() {
    const wrapPos = this.wrap.getBoundingClientRect();
    const imagePos = this.imgNode.getBoundingClientRect();
    this.resizer.style.left = `${imagePos.x - wrapPos.x}px`;
    this.resizer.style.top = `${imagePos.y - wrapPos.y}px`;
    this.resizer.style.width = `${this.imgNode.offsetWidth}px`;
    this.resizer.style.height = `${this.imgNode.offsetHeight}px`;
  }

  hide() {
    this.imgNode = null;
    this.resizer.style.display = 'none';
  }

  showContainer() {
    this.resizer.style.display = 'block';
    this.updateImageStyle();
  }

  createResizer() {
    const container = document.createElement('div');
    container.style = `position: absolute;border: 1px solid rgb(59, 119, 255);display: none;`;
    container.classList.add('ql-image-resizer');
    let innerHtml = '';
    for (let i = 0; i < 8; i += 1) {
      innerHtml += `<span class="ql-image-resizer-hand${i}"></span>`;
    }
    container.innerHTML = innerHtml;
    this.wrap.appendChild(container);
    return container;
  }
}

export default ImageResizer;
