import Module from '../core/module';
import { TableCellLine, TableRow, TableCell } from '../formats/table';
import constant from '../config/constant';
import mergeIcon from '../assets/tiku-icons/table-merge-cells.svg';
import unmergeIcon from '../assets/tiku-icons/table-unmerge-cells.svg';

const svgs = {
  'merge-cells': mergeIcon,
  'unmerge-cells': unmergeIcon,
};

const menus = [
  [
    {
      id: 'delete-table',
      title: '删除表格',
      handler(table) {
        table.deleteTable();
      },
    },
  ],
  [
    {
      id: 'delete-row',
      title: '删除当前行',
      handler(table) {
        table.deleteRow();
      },
    },
    {
      id: 'delete-col',
      title: '删除当前列',
      handler(table) {
        table.deleteColumn();
      },
    },
    {
      id: 'insert-col-left',
      title: '左插入列',
      handler(table) {
        table.insertColumnLeft();
      },
    },
    {
      id: 'insert-col-right',
      title: '右插入列',
      handler(table) {
        table.insertColumnRight();
      },
    },
    {
      id: 'insert-row-above',
      title: '前插入行',
      handler(table) {
        table.insertRowAbove();
      },
    },
    {
      id: 'insert-row-below',
      title: '后插入行',
      handler(table) {
        table.insertRowBelow();
      },
    },
  ],
  [
    {
      id: 'align-left',
      title: '表格左浮动',
      handler(table) {
        alignTable(table, 'left');
      },
    },
    {
      id: 'align-center',
      title: '表格居中显示',
      handler(table) {
        alignTable(table, 'center');
      },
    },
    {
      id: 'align-right',
      title: '表格右浮动',
      handler(table) {
        alignTable(table, 'right');
      },
    },
  ],
  [
    {
      id: 'insert-diagonal',
      title: '插入对角线',
      handler(table) {
        const [, , cell] = table.getTable();
        cell.domNode.classList.add(constant.tableDiagonalClass);
        cell.descendants(TableCellLine).forEach(line => {
          line.format('diagonal', 'normal');
        });
      },
    },
    {
      id: 'delete-diagonal',
      title: '删除对角线',
      handler(table) {
        const [, , cell] = table.getTable();
        cell.domNode.classList.remove(constant.tableDiagonalClass);
        cell.descendants(TableCellLine).forEach(line => {
          line.format('diagonal', '');
        });
      },
    },
  ],
  [
    {
      id: 'merge-cells',
      title: '合并单元格',
      handler() {
        const { startRow, startCol, endRow, endCol } = this.cellsRange;
        const selectedCells = [];
        const rows = this.table.descendants(TableRow);
        rows.forEach(row => {
          row.descendants(TableCell).forEach(cell => {
            if (cell.domNode.classList.contains(this.selectedClass)) {
              selectedCells.push(cell);
            }
          });
        });
        const theCell = selectedCells[0];
        theCell.descendants(TableCellLine).forEach(line => {
          line.format('rowspan', endRow - startRow + 1);
          line.format('colspan', endCol - startCol + 1);
          line.optimize();
        });
        for (let i = 1; i < selectedCells.length; i++) {
          selectedCells[i].remove();
        }
      },
    },
    {
      id: 'unmerge-cells',
      title: '取消合并单元格',
      handler: () => {},
    },
  ],
];

const prefixClass = 'table-menu';

class TableMenu extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.root = quill.root;
    this.menus = menus;
    this.dom = this.createMenu();
    this.selectedCells = [];
    this.selectedTable = null;
    this.startTd = null;
    this.cellsRange = {};
    this.mouseMoveFrame = false;
    this.tableCells = null;
    this.selectedClass = 'table-cell-selected';
    quill.container.appendChild(this.dom);
    this.root.addEventListener('contextmenu', e => {
      if (containsByTable(e.target, this.root)) {
        e.preventDefault();
        this.showMenu(true, { x: e.clientX, y: e.clientY });
      }
    });
    document.addEventListener(
      'mousedown',
      ({ target, button }) => {
        if (button === 0 && !this.dom.contains(target)) {
          this.clearSelected();
          this.selectedTable = null;
        }
      },
      true,
    );
    this.root.addEventListener('mousedown', e => {
      if (e.button === 0 && containsByTable(e.target, this.root)) {
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
    if (bool) {
      const rootRect = this.quill.container.getBoundingClientRect();
      this.dom.style.left = `${mousePos.x - rootRect.left}px`;
      this.dom.style.top = `${mousePos.y - rootRect.top}px`;
    }
    this.dom.style.display = displayVal;
  }

  createMenu() {
    const wrappper = document.createElement('div');
    wrappper.classList.add(`${prefixClass}-wrapper`);
    this.menus.forEach((menu, index) => {
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
          item.handler.apply(this, table);
          this.showMenu(false);
        });
        wrappper.appendChild(div);
      });
      if (index !== this.menus.length - 1) {
        wrappper.appendChild(createHorizontalLine());
      }
    });
    wrappper.appendChild(createVerticalLine());
    return wrappper;
  }

  mouseDown(eventTarget) {
    let node = eventTarget;
    this.startTd = getTd(node);
    const { row, col } = getTdIndex(this.startTd);
    this.cellsRange.startRow = row;
    this.cellsRange.startCol = col;
    while (node.tagName.toUpperCase() !== 'TABLE') {
      node = node.parentNode;
    }
    this.clearSelected();
    document.addEventListener(
      'selectionchange',
      () => {
        [this.table] = this.quill.getModule('table').getTable();
        console.log('table', this.table);
      },
      { once: true },
    );
    this.selectedTable = node;
    this.tableCells = this.selectedTable.querySelectorAll('td');
    const mouseMoveListener = this.mouseMove.bind(this);
    this.selectedTable.addEventListener('mousemove', mouseMoveListener);
    document.addEventListener(
      'mouseup',
      () => {
        this.selectedTable.removeEventListener('mousemove', mouseMoveListener);
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
      if (
        target !== this.selectedTable &&
        this.selectedTable.contains(target)
      ) {
        const td = getTd(target);
        const { row, col } = getTdIndex(td);
        if (row === this.cellsRange.endRow && col === this.cellsRange.endCol) {
          return;
        }
        this.cellsRange.endRow = row;
        this.cellsRange.endCol = col;
        this.updateSelectedCells();
      }
    });
  }

  updateSelectedCells() {
    this.clearSelected();
    let { startRow, startCol, endRow, endCol } = this.cellsRange;
    if (startRow === endRow && startCol === endCol) {
      return;
    }

    this.quill.setSelection(null);
    if (startRow > endRow) {
      [startRow, endRow] = [endRow, startRow];
    }
    if (startCol > endCol) {
      [startCol, endCol] = [endCol, startCol];
    }
    console.log('startRow', startRow);
    console.log('startCol', startCol);
    let rowTotal = 0;
    let colTotal = 0;
    const rowArr = [];
    const colArr = [];
    const rows = this.selectedTable.getElementsByTagName('tr');
    const cells = [];
    const validCells = [];
    for (let i = startRow; i <= endRow; i++) {
      const tds = rows[i].getElementsByTagName('td');
      let col = 0;
      const row = [];
      for (let j = startCol; j <= endCol; j++) {
        row.push(tds[j]);
        col += +tds[j].getAttribute('colspan') || 1;
        rowTotal += +tds[j].getAttribute('rowspan') || 1;
      }
      cells.push(validCells);
      colArr.push(col);
      validCells.push(row);
    }
    for (let i = 0; i < validCells[0].length; i++) {
      let row = 0;
      for (let j = 0; j < validCells.length; j++) {
        row += +validCells[j][i].getAttribute('rowspan');
      }
      rowArr.push(row);
    }
    const colMax = Math.max(...colArr);
    const rowMax = Math.max(...rowArr);
    console.log('valid', validCells);
    console.log('colMax', colMax);
    console.log('rowMax', rowMax);
    let rowCur = 0;
    let colCur = 0;
    let isBreak = false;
    // while (colCur < colMax || rowCur < rowMax) {

    // }
    for (let i = startRow; i <= endRow; i++) {
      const tds = rows[i].getElementsByTagName('td');
      for (let j = startCol; j <= endCol; j++) {
        tds[j].classList.add(this.selectedClass);
        // j += +tds[j].getAttribute('rowspan') || 1;
        // i += +tds[j].getAttribute('colspan') || 1;
      }
    }
  }

  clearSelected() {
    if (!this.selectedTable) {
      return;
    }
    const cells = this.selectedTable.querySelectorAll(`.${this.selectedClass}`);
    for (let i = 0; i < cells.length; i++) {
      cells[i].classList.remove(this.selectedClass);
    }
  }
}

function getTd(node) {
  while (node.tagName.toUpperCase() !== 'TD') {
    if (node.tagName.toUpperCase() === 'BODY') {
      return null;
    }
    node = node.parentNode;
  }
  return node;
}

function getTdIndex(td) {
  const tr = td.parentNode;
  let table = td;
  while (table.tagName.toUpperCase() !== 'TABLE') {
    table = table.parentNode;
  }

  const trs = Array.from(table.querySelectorAll('tr'));

  return {
    row: trs.indexOf(tr),
    col: Array.from(tr.children).indexOf(td),
  };
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

function alignTable(table, align) {
  const [tableContainer] = table.getTable();
  tableContainer.domNode.setAttribute('table-align', align);
  const lines = tableContainer.descendants(TableCellLine);
  lines.forEach(line => {
    line.format('tbalign', align);
    line.optimize();
  });
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
