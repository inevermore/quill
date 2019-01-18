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
      [1, 1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, -1],
      [-1, 0],
    ];
    this.wrap.addEventListener('click', e => {
      if (
        e.target.tagName.toUpperCase() === 'IMG' &&
        (!this.imgNode || e.target !== this.imgNode)
      ) {
        this.addResizer(e.target);
      } else {
        this.removeResizer();
      }
    });
    document.addEventListener('mouseup', () => {
      this.handId = -1;
      this.imgNode = null;
      this.wrap.removeEventListener('mousemove', this.mouseMove);
    });
  }

  addResizer(imgNode) {
    this.imgNode = imgNode;
    this.scale = this.imgNode.width / this.imgNode.height;
    this.showContainer(this.imgNode);
    this.resizer.addEventListener('mousedown', e => this.mouseDown(e));
  }

  mouseDown(e) {
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
      this.wrap.addEventListener('mousemove', ele => {
        if (this.handId < 0) return;
        this.mouseMove({
          x: ele.clientX - this.prePos.x,
          y: ele.clientY - this.prePos.y,
        });
      });
    }
  }

  mouseMove(offset) {
    console.log('offset', offset);
    console.log('origin', this.originSize);
    const widthDir = this.rect[this.handId][0];
    const heightDir = this.rect[this.handId][1];
    // adjust height only
    if (widthDir === 0 || heightDir === 0) {
      this.resizeImage(
        this.originSize.width + widthDir * offset.x,
        this.originSize.height + heightDir * offset.y,
      );
    } else {
      let width = widthDir * offset.x;
      let height = heightDir * offset.y;
      if (Math.abs(offset.x) / Math.abs(offset.y) > this.scale) {
        height = heightDir * (offset.x / this.scale);
      } else {
        width = widthDir * (offset.y * this.scale);
      }
      this.resizeImage(this.originSize.width + width, this.originSize.height + height);
    }
  }

  resizeImage(width, height) {
    console.log(width, height);
    this.resizer.style.width = `${width}px`;
    this.imgNode.width = width;
    this.resizer.style.height = `${height}px`;
    this.imgNode.height = height;
  }

  removeResizer() {
    this.imgNode = null;
    this.resizer.style.display = 'none';
  }

  showContainer({ offsetLeft, offsetTop, offsetWidth, offsetHeight }) {
    this.resizer.style.left = `${offsetLeft}px`;
    this.resizer.style.top = `${offsetTop}px`;
    this.resizer.style.width = `${offsetWidth}px`;
    this.resizer.style.height = `${offsetHeight}px`;
    this.resizer.style.display = 'block';
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
    this.quill.container.appendChild(container);
    return container;
  }
}

export default ImageResizer;
