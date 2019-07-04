/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
const ROW_NUM = 8; // 最大行数
const COL_NUM = 10; // 最大列数
const MARGIN_TOP = 10; // 选择区域距 button 距离

let tds = [];

class TableInsert {
  constructor() {
    this.title = null;
    const update = this.update.bind(this);
    this.activeIndex = new Proxy(
      {},
      {
        set(obj, prop, value) {
          obj[prop] = value;
          update();
          return true;
        },
      },
    );
    this.resetActiveIndex();
    this.defaultTitle = '选择表格大小';
    this.selectArea = this.createSelectArea();
    this.button = null;
    document.addEventListener('click', this.clickEvent.bind(this));
    document.body.appendChild(this.selectArea);
  }

  createSelectArea() {
    const container = document.createElement('div');
    container.classList.add('select-area');
    this.title = document.createElement('p');
    this.title.classList.add('table-title');
    this.title.innerText = this.defaultTitle;
    container.appendChild(this.title);
    const choose = document.createElement('div');
    for (let i = 0; i < ROW_NUM; i++) {
      const tr = document.createElement('div');
      tr.classList.add('tr');
      for (let j = 0; j < COL_NUM; j++) {
        const span = document.createElement('span');
        span.classList.add('td');
        span.dataset.row = i;
        span.dataset.col = j;
        span.addEventListener('mouseenter', () => {
          this.activeIndex.row = i;
          this.activeIndex.col = j;
        });
        tr.appendChild(span);
      }
      choose.appendChild(tr);
    }
    choose.addEventListener('mouseleave', this.resetActiveIndex.bind(this));
    choose.addEventListener('click', this.insertTable.bind(this));
    tds = choose.getElementsByClassName('td');
    container.appendChild(choose);
    return container;
  }

  clickEvent({ target }) {
    if (
      !(
        (this.button && this.button.contains(target)) ||
        this.selectArea.contains(target)
      )
    ) {
      this.hide();
    }
  }

  update() {
    for (const node of tds) {
      const { row, col } = node.dataset;
      if (row <= this.activeIndex.row && col <= this.activeIndex.col) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    }
    if (!this.title) {
      return;
    }
    if (this.activeIndex.row < 0 || this.activeIndex.col < 0) {
      this.title.innerText = this.defaultTitle;
    } else {
      this.title.innerText = `插入${this.activeIndex.col + 1}x${this.activeIndex
        .row + 1}表格`;
    }
  }

  resetActiveIndex() {
    this.activeIndex.row = -1;
    this.activeIndex.col = -1;
  }

  insertTable() {
    const table = this.quill.getModule('table');
    table.insertTable(this.activeIndex.row + 1, this.activeIndex.col + 1);
    this.hide();
  }

  show(quill) {
    this.quill = quill;
    this.selectArea.style.display = 'block';
    this.button = this.quill.toolbarContainer.querySelector('.ql-table-insert');
    this.setPosition(this.button);
    document.addEventListener('scroll', () => {
      this.hide();
    });
  }

  setPosition(button) {
    const btnRect = button.getBoundingClientRect();
    let left =
      btnRect.left - (this.selectArea.offsetWidth - btnRect.width) * 0.5;
    if (left + this.selectArea.offsetWidth > window.innerWidth) {
      left = window.innerWidth - this.selectArea.offsetWidth;
    }
    this.selectArea.style.left = `${Math.max(left, 0)}px`;
    this.selectArea.style.top = `${btnRect.top +
      btnRect.height +
      MARGIN_TOP}px`;
  }

  hide() {
    this.selectArea.style.display = 'none';
    this.button = null;
  }
}

export default new TableInsert();
