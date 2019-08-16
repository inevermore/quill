import Module from '../core/module';
import mergeIcon from '../assets/tiku-icons/table-merge-cells.svg';
import unmergeIcon from '../assets/tiku-icons/table-unmerge-cells.svg';
import diagonalIcon from '../assets/tiku-icons/table-diagonal.svg';
import deleteDiagonalIcon from '../assets/tiku-icons/table-delete-diagonal.svg';
import menuConfig from '../config/table-menu';
import constant from '../config/constant';
import { isContainByTable, getTdParent } from '../utils/dom-utils';

const svgs = {
  'merge-cells': mergeIcon,
  'unmerge-cells': unmergeIcon,
  'insert-diagonal': diagonalIcon,
  'delete-diagonal': deleteDiagonalIcon,
};

const prefixClass = 'table-menu';

class TableMenu extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.root = quill.root;
    this.menuConfig = menuConfig;
    this.menuNodes = [];
    this.dom = this.createMenu();
    this.showMenu(false);
    this.selectedCells = [];
    this.table = null;
    this.startTd = null;
    this.currentTd = null;
    this.cellsRange = {};
    this.mouseMoveFrame = false;
    this.selectedClass = 'table-cell-selected';
    quill.container.appendChild(this.dom);
    this.root.addEventListener('contextmenu', e => {
      if (isContainByTable(e.target, this.root)) {
        e.preventDefault();
        this.showMenu(true, { x: e.clientX, y: e.clientY });
        const td = getTdParent(e.target);
        const {
          startRowIndex,
          endRowIndex,
          startColIndex,
          endColIndex,
        } = this.cellsRange;
        const isSelected =
          startRowIndex !== endRowIndex || startColIndex !== endColIndex;
        if (isSelected) {
          this.showMenuItem('merge-cells', true);
        } else if (td.rowSpan > 1 || td.colSpan > 1) {
          this.showMenuItem('unmerge-cells', true);
        }
        if (!isSelected) {
          if (td.classList.contains(constant.tableDiagonalClass)) {
            this.showMenuItem('delete-diagonal', true);
          } else {
            this.showMenuItem('insert-diagonal', true);
          }
        }
      }
    });
    document.addEventListener(
      'mousedown',
      ({ target, button }) => {
        if (button === 0 && !this.dom.contains(target)) {
          this.clearSelected();
          this.table = null;
          this.enableSelect(true);
        }
      },
      true,
    );
    this.root.addEventListener('mousedown', e => {
      if (e.button === 0 && isContainByTable(e.target, this.root)) {
        this.mouseDown(e.target);
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
    if (this.dom.style.display === displayVal) {
      return;
    }
    if (bool) {
      const rootRect = this.quill.container.getBoundingClientRect();
      this.dom.style.left = `${mousePos.x - rootRect.left}px`;
      this.dom.style.top = `${mousePos.y - rootRect.top}px`;
    } else {
      this.clearSelected();
      this.showMenuItem('unmerge-cells', false);
      this.showMenuItem('merge-cells', false);
      this.showMenuItem('delete-diagonal', false);
      this.showMenuItem('insert-diagonal', false);
    }
    this.dom.style.display = displayVal;
  }

  createMenu() {
    const wrappper = document.createElement('div');
    wrappper.classList.add(`${prefixClass}-wrapper`);
    this.menuConfig.forEach((menu, index) => {
      menu.forEach(item => {
        const div = document.createElement('div');
        div.classList.add(`${prefixClass}-item`);
        div.classList.add(`${prefixClass}-${item.id}`);
        const icon = document.createElement('i');
        if (item.id in svgs) {
          icon.innerHTML = svgs[item.id];
        }
        icon.classList.add(`${prefixClass}-icon-box`);
        div.appendChild(icon);
        const title = document.createElement('span');
        title.innerText = item.title;
        title.classList.add(`${prefixClass}-item-title`);
        div.appendChild(title);
        div.addEventListener('click', () => {
          const table = this.quill.getModule('table');
          item.handler.call(this, table);
          this.showMenu(false);
        });
        this.menuNodes[item.id] = div;
        wrappper.appendChild(div);
      });
      if (index !== this.menuConfig.length - 1) {
        wrappper.appendChild(createHorizontalLine());
      }
    });
    wrappper.appendChild(createVerticalLine());
    return wrappper;
  }

  mouseDown(eventTarget) {
    let node = eventTarget;
    this.startTd = getTdParent(node);
    while (node.tagName.toUpperCase() !== 'TABLE') {
      node = node.parentNode;
    }
    this.table = node;
    this.clearSelected();
    const mouseMoveListener = this.mouseMove.bind(this);
    this.table.addEventListener('mousemove', mouseMoveListener);
    document.addEventListener(
      'mouseup',
      () => {
        this.enableSelect(true);
        this.table.removeEventListener('mousemove', mouseMoveListener);
      },
      {
        once: true,
      },
    );
  }

  mouseMove({ target }) {
    if (this.mouseMoveFrame) {
      return;
    }

    this.mouseMoveFrame = true;
    requestAnimationFrame(() => {
      this.mouseMoveFrame = false;
      if (target !== this.table && this.table.contains(target)) {
        const td = getTdParent(target);
        if (td === this.currentTd) {
          return;
        }
        this.currentTd = td;
        this.updateSelectedCells(this.startTd, td);
      }
    });
  }

  updateSelectedCells(startTd, endTd) {
    this.clearSelected();
    const [table] = this.quill.getModule('table').getTable();
    const cellsRange = table.getCellsRange(startTd, endTd);
    this.cellsRange = cellsRange;
    const cells = table.getCells(cellsRange);
    if (!cells || cells.length <= 1) {
      return;
    }

    this.quill.blur();
    this.enableSelect(false);
    Array.from(cells).forEach(cell => {
      cell.domNode.classList.add(this.selectedClass);
    });
  }

  clearSelected() {
    this.cellsRange = {};
    if (!this.table) {
      return;
    }
    const cells = this.table.querySelectorAll(`.${this.selectedClass}`);
    for (let i = 0; i < cells.length; i++) {
      cells[i].classList.remove(this.selectedClass);
    }
  }

  enableSelect(bool) {
    this.quill.root.style.webkitUserSelect = bool ? '' : 'none';
  }

  showMenuItem(id, bool) {
    this.menuNodes[id].style.display = bool ? 'flex' : 'none';
  }
}

function createVerticalLine() {
  const div = document.createElement('div');
  div.classList.add(`${prefixClass}-ver-line`);
  return div;
}

function createHorizontalLine() {
  const div = document.createElement('div');
  div.classList.add(`${prefixClass}-hor-line`);
  return div;
}

export default TableMenu;
