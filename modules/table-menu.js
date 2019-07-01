import Module from '../core/module';

class TableMenu extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.root = quill.root;
    this.prefixClass = 'table-menu';
    this.menus = [
      {
        id: 'delete-table',
        title: '删除表格',
        handler: table => table.deleteTable(),
      },
      {
        id: 'delete-row',
        title: '删除当前行',
        handler: table => table.deleteRow(),
      },
      {
        id: 'delete-col',
        title: '删除当前列',
        handler: table => table.deleteColumn(),
      },
      {
        id: 'insert-col-left',
        title: '左插入列',
        handler: table => table.insertColumnLeft(),
      },
      {
        id: 'insert-col-right',
        title: '右插入列',
        handler: table => table.insertColumnRight(),
      },
      {
        id: 'insert-row-above',
        title: '前插入行',
        handler: table => table.insertRowAbove(),
      },
      {
        id: 'insert-row-below',
        title: '后插入行',
        handler: table => table.insertRowBelow(),
      },
      {
        id: 'align-left',
        title: '表格左浮动',
        handler: table => {
          const [tableContainer] = table.getTable();
          tableContainer.domNode.setAttribute('table-align', 'left');
        },
      },
      {
        id: 'align-center',
        title: '表格居中显示',
        handler: table => {
          const [tableContainer] = table.getTable();
          tableContainer.domNode.setAttribute('table-align', 'center');
        },
      },
      {
        id: 'align-right',
        title: '表格右浮动',
        handler: table => {
          const [tableContainer] = table.getTable();
          tableContainer.domNode.setAttribute('table-align', 'right');
        },
      },
      {
        id: 'insert-diagonal',
        title: '插入对角线',
        handler: () => {
          this.quill.format('table-diagonal', 'normal');
        },
      },
      {
        id: 'delete-diagonal',
        title: '删除对角线',
        handler: () => {
          this.quill.format('table-diagonal', false);
        },
      },
    ];
    this.dom = this.createMenu();
    quill.container.appendChild(this.dom);
    this.root.addEventListener('contextmenu', e => {
      if (containsByTable(e.target, this.root)) {
        e.preventDefault();
        this.showMenu(true, { x: e.clientX, y: e.clientY });
      }
    });
    document.addEventListener('click', ({ target }) => {
      if (!this.dom.contains(target)) {
        this.showMenu(false);
      }
    });
  }

  showMenu(bool, mousePos) {
    const displayVal = bool ? 'block' : 'none';
    if (bool) {
      const rootRect = this.quill.container.getBoundingClientRect();
      this.dom.style.left = `${mousePos.x - rootRect.left}px`;
      this.dom.style.top = `${mousePos.y - rootRect.top}px`;
    }
    this.dom.style.display = displayVal;
  }

  createMenu() {
    const wrappper = document.createElement('div');
    wrappper.classList.add(`${this.prefixClass}-wrapper`);
    this.menus.forEach(item => {
      const div = document.createElement('div');
      div.classList.add(`${this.prefixClass}-item`);
      div.classList.add(`${this.prefixClass}-${item.id}`);
      const icon = document.createElement('i');
      icon.classList.add(`${this.prefixClass}-icon-box`);
      div.appendChild(icon);
      const title = document.createElement('span');
      title.innerText = item.title;
      title.classList.add(`${this.prefixClass}-item-title`);
      div.appendChild(title);
      div.addEventListener('click', () => {
        const table = this.quill.getModule('table');
        item.handler(table);
        this.showMenu(false);
      });
      wrappper.appendChild(div);
    });
    return wrappper;
  }
}

function containsByTable(node, root) {
  while (root.contains(node)) {
    if (node.tagName.toUpperCase() === 'TABLE') {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export default TableMenu;
