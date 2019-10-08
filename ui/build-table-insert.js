/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
const ROW_NUM = 8;
const COL_NUM = 10;

class TableInsert {
  constructor() {
    this.tds = [];
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
  }

  buildTableInsert(quill) {
    this.quill = quill;
    const container = document.createElement('div');
    container.classList.add('table-insert');
    container.setAttribute('title', '插入表格');
    container.appendChild(this.createButton());
    container.appendChild(this.createSelectArea());
    document.addEventListener('click', ({ target }) => {
      if (!container.contains(target)) {
        this.show(false);
      }
    });
    return container;
  }

  createButton() {
    const button = document.createElement('button');
    const icon = document.createElement('i');
    icon.classList.add('button-icon');
    button.appendChild(icon);
    button.addEventListener('click', this.show.bind(this, true));
    return button;
  }

  createSelectArea() {
    const container = document.createElement('div');
    container.classList.add('select-area');
    this.selectArea = container;
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
    this.tds = choose.getElementsByClassName('td');
    container.appendChild(choose);
    return container;
  }

  update() {
    for (const node of this.tds) {
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
    this.show(false);
  }

  show(bool) {
    const displayAttr = bool ? 'block' : 'none';
    this.selectArea.style.display = displayAttr;
  }
}

export default TableInsert;
