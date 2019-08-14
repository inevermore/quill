import Block from '../blots/block';
import Container from '../blots/container';
import { AlignClass } from './align';
import constant from '../config/constant';
import Empty from '../blots/empty';

const CELL_ATTR = ['row', 'rowspan', 'colspan', 'diagonal', 'tbalign'];
const LINE_ATTR = ['cell'];

class TableCellLine extends Block {
  static create(value = {}) {
    const node = super.create(value);

    ['row', 'cell'].forEach(key => {
      const identityMaker = key === 'row' ? rowId : cellId;
      node.setAttribute(`data-${key}`, value[key] || identityMaker());
    });
    ['rowspan', 'colspan', 'diagonal', 'tbalign'].forEach(attrName => {
      if (value[attrName]) {
        node.setAttribute(`data-${attrName}`, value[attrName]);
      }
    });

    AlignClass.add(node, AlignClass.value(node) || 'center');

    return node;
  }

  static formats(domNode) {
    const formats = LINE_ATTR.concat(CELL_ATTR).reduce((format, attribute) => {
      if (domNode.hasAttribute(`data-${attribute}`)) {
        format[attribute] = domNode.getAttribute(`data-${attribute}`) || '';
      }
      return format;
    }, {});
    formats.align = AlignClass.value(domNode) || 'center';
    return formats;
  }

  format(name, value) {
    if (LINE_ATTR.concat(CELL_ATTR).indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(`data-${name}`, value);
      } else {
        this.domNode.removeAttribute(`data-${name}`);
      }
    } else {
      super.format(name, value);
    }
  }

  optimize(...args) {
    super.optimize(...args);
    const { row, rowspan, colspan, tbalign, diagonal } = TableCellLine.formats(
      this.domNode,
    );
    const formats = TableCellLine.formats(this.domNode);
    if (this.statics.requiredContainer) {
      if (!(this.parent instanceof this.statics.requiredContainer)) {
        this.wrap(this.statics.requiredContainer.blotName, {
          row,
          colspan,
          rowspan,
          tbalign,
          diagonal,
        });
      } else {
        CELL_ATTR.forEach(key => {
          if (formats[key] !== this.parent.formats()[key]) {
            formatCell(this.parent.domNode, key, formats[key]);
          }
        });
      }
    }
  }

  tableCell() {
    return this.parent;
  }
}
TableCellLine.blotName = 'table-cell-line';
TableCellLine.className = 'qltb-cell-line';
TableCellLine.tagName = 'P';

class TableCell extends Container {
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const thisHead = this.children.head.formats()[
        this.children.head.statics.blotName
      ];
      const thisTail = this.children.tail.formats()[
        this.children.tail.statics.blotName
      ];
      const nextHead = this.next.children.head.formats()[
        this.next.children.head.statics.blotName
      ];
      const nextTail = this.next.children.tail.formats()[
        this.next.children.tail.statics.blotName
      ];
      return (
        thisHead.cell === thisTail.cell &&
        thisHead.cell === nextHead.cell &&
        thisHead.cell === nextTail.cell
      );
    }
    return false;
  }

  static create(
    value = {
      row: rowId(),
      rowspan: 1,
      colspan: 1,
      tbalign: '',
    },
  ) {
    const node = super.create(value);
    Object.entries(value).forEach(([k, v]) => {
      formatCell(node, k, v);
    });
    return node;
  }

  cellOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  }

  format(name, value) {
    formatCell(this.domNode, name, value);
  }

  formats() {
    const formats = {};

    if (this.domNode.hasAttribute('data-row')) {
      formats.row = this.domNode.dataset.row;
    }

    formats.tbalign = this.domNode.dataset.tbalign || '';
    formats.diagonal = this.domNode.dataset.diagonal || '';

    return ['rowspan', 'colspan'].reduce((prev, attribute) => {
      if (this.domNode.hasAttribute(attribute)) {
        prev[attribute] = this.domNode.getAttribute(attribute);
      }

      return prev;
    }, formats);
  }

  optimize(...args) {
    const { row, tbalign } = this.formats();

    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName, {
        row,
        tbalign,
      });
    } else if (tbalign !== this.parent.formats().tbalign) {
      if (tbalign) {
        this.parent.domNode.setAttribute('data-tbalign', tbalign);
      } else {
        this.parent.domNode.removeAttribute('data-tbalign');
      }
    }
    this.children.forEach(child => {
      if (child.next == null) return;
      const childFormats = TableCellLine.formats(child.domNode);
      const nextFormats = TableCellLine.formats(child.next.domNode);
      if (childFormats.cell !== nextFormats.cell) {
        const next = this.splitAfter(child);
        if (next) {
          next.optimize();
        }
        // We might be able to merge with prev now
        if (this.prev) {
          this.prev.optimize();
        }
      }
    });
    super.optimize(...args);
  }

  row() {
    return this.parent;
  }

  rowOffset() {
    if (this.row()) {
      return this.row().rowOffset();
    }
    return -1;
  }

  table() {
    return this.row() && this.row().table();
  }

  isEmpty() {
    return (
      this.children.length === 1 &&
      this.children.head.children.head instanceof Empty
    );
  }
}
TableCell.blotName = 'table';
TableCell.tagName = 'TD';

function formatCell(node, key, value) {
  if (['rowspan', 'colspan'].includes(key)) {
    if (value) {
      node.setAttribute(key, value);
    } else {
      node.removeAttribute(key);
    }
  }
  if (key === 'diagonal') {
    if (value) {
      node.classList.add(constant.tableDiagonalClass);
    } else {
      node.classList.remove(constant.tableDiagonalClass);
    }
  }
  if (['row', 'tbalign'].includes(key)) {
    if (value) {
      node.setAttribute(`data-${key}`, value);
    } else {
      node.removeAttribute(`data-${key}`);
    }
  }
}

class TableRow extends Container {
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const thisHead = this.children.head.formats();
      const thisTail = this.children.tail.formats();
      const nextHead = this.next.children.head.formats();
      const nextTail = this.next.children.tail.formats();
      return (
        thisHead.row === thisTail.row &&
        thisHead.row === nextHead.row &&
        thisHead.row === nextTail.row
      );
    }
    return false;
  }

  static create(value) {
    const node = super.create(value);
    if (value.tbalign) {
      node.dataset.tbalign = value.tbalign;
    }
    return node;
  }

  formats() {
    if (this.domNode.dataset.tbalign) {
      return {
        tbalign: this.domNode.dataset.tbalign,
      };
    }
    return {};
  }

  optimize(...args) {
    const { tbalign } = this.formats();
    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName, { tbalign });
    } else if (tbalign !== this.parent.domNode.dataset.tbalign) {
      if (tbalign) {
        this.parent.domNode.setAttribute('data-tbalign', tbalign);
      } else {
        this.parent.domNode.removeAttribute('data-tbalign');
      }
    }

    this.children.forEach(child => {
      if (child.next == null) return;
      const childFormats = child.formats();
      const nextFormats = child.next.formats();
      if (childFormats.row !== nextFormats.row) {
        const next = this.splitAfter(child);
        if (next) {
          next.optimize();
        }
        if (this.prev) {
          this.prev.optimize();
        }
      }
    });
    super.optimize(...args);
  }

  rowOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  }

  table() {
    return this.parent && this.parent.parent;
  }

  rowLength() {
    return this.children.reduce((sum, child) => {
      const { colspan } = child.formats();
      return sum + colspan * 1;
    }, 0);
  }
}
TableRow.blotName = 'table-row';
TableRow.tagName = 'TR';

class TableBody extends Container {
  static create(value) {
    const node = super.create(value);
    if (value.tbalign) {
      node.dataset.tbalign = value.tbalign;
    }
    return node;
  }

  optimize(...args) {
    super.optimize(...args);
    const { tbalign } = this.domNode.dataset;

    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName, {
        tbalign,
      });
    } else if (tbalign !== this.parent.domNode.getAttribute('table-align')) {
      if (tbalign) {
        this.parent.domNode.setAttribute('table-align', tbalign);
      } else {
        this.parent.domNode.removeAttribute('table-align');
      }
    }
  }
}
TableBody.blotName = 'table-body';
TableBody.tagName = 'TBODY';

class TableContainer extends Container {
  balanceCells() {}

  cells(column) {
    return this.rows().map(row => row.children.at(column));
  }

  deleteColumn(index) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null) return;
    body.children.forEach(row => {
      const cell = row.children.at(index);
      if (cell != null) {
        cell.remove();
      }
    });
  }

  insertColumn(index) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null) return;
    body.children.forEach(rowBlot => {
      const ref = rowBlot.children.at(index);
      const { rowspan, row, tbalign } = rowBlot.children.head.formats();
      const cell = this.scroll.create(TableCell.blotName, {
        rowspan,
        colspan: 1,
        row,
        tbalign,
      });
      const cellLine = this.scroll.create(TableCellLine.blotName, {
        row,
        cell: cellId(),
        rowspan,
        tbalign,
      });
      cell.appendChild(cellLine);
      rowBlot.insertBefore(cell, ref);
    });
  }

  insertRow(index) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null) return;
    const id = rowId();
    const newRow = this.scroll.create(TableRow.blotName, { row: id });
    const rows = this.descendants(TableRow);
    const { rowspan, tbalign } = rows[0].children.head.formats();
    const maxColumns = rows.reduce((max, row) => {
      return Math.max(row.children.length, max);
    }, 0);
    new Array(maxColumns).fill(0).forEach(() => {
      const cell = this.scroll.create(TableCell.blotName, {
        row: id,
        rowspan,
        colspan: 1,
        tbalign,
      });
      const cellLine = this.scroll.create(TableCellLine.blotName, {
        row: id,
        cell: cellId(),
        rowspan,
        tbalign,
      });
      cell.appendChild(cellLine);
      newRow.appendChild(cell);
    });
    const ref = body.children.at(index);
    body.insertBefore(newRow, ref);
  }

  rows() {
    const body = this.children.head;
    if (body == null) return [];
    return body.children.map(row => row);
  }

  optimize(...args) {
    super.optimize(...args);
    this.updateIndexTable();
  }

  mergeRange(cellsRange) {
    const {
      beginRowIndex,
      beginColIndex,
      endRowIndex,
      endColIndex,
    } = cellsRange;
    const leftTopCell = this.getCell(
      beginRowIndex,
      this.indexTable[beginRowIndex][beginColIndex].cellIndex,
    );
    let rowSpan = endRowIndex - beginRowIndex + 1;
    let colSpan = endColIndex - beginColIndex + 1;
    // 合并后占整行或者整列时，优化colspan、rowspan
    if (rowSpan === this.rowsNum && colSpan !== 1) {
      colSpan = 1;
    }
    if (colSpan === this.colsNum && rowSpan !== 1) {
      rowSpan = 1;
    }
    const cells = this.getCells(cellsRange);
    const lineFormats = TableCellLine.formats(
      leftTopCell.children.head.domNode,
    );
    lineFormats.rowspan = rowSpan;
    lineFormats.colspan = colSpan;
    let isLeftTopEmpty = leftTopCell.isEmpty();
    // 合并内容，若合并单元格内容为空，则不合并该单元格内容
    cells.forEach(cell => {
      if (cell !== leftTopCell) {
        if (!cell.isEmpty()) {
          if (isLeftTopEmpty) {
            leftTopCell.children.head.remove();
            isLeftTopEmpty = false;
          }
          cell.moveChildren(leftTopCell);
        }
        cell.remove();
      }
    });
    leftTopCell.children.forEach(line => {
      Object.keys(lineFormats).forEach(key => {
        line.format(key, lineFormats[key]);
      });
    });
    return leftTopCell;
  }

  splitToCells(targetCell) {
    const { rowIndex, colIndex, rowSpan, colSpan } = this.getCellInfo(
      targetCell.domNode,
    );
    targetCell.children.forEach(child => {
      child.format('rowspan', 1);
      child.format('colspan', 1);
    });
    for (let i = rowIndex; i < rowIndex + rowSpan; i++) {
      const row = this.descendants(TableRow)[i];
      const id = row.children.head.formats().row;
      const { tbalign } = row.children.head.formats();
      for (let j = colIndex; j < colIndex + colSpan; j++) {
        const cell = this.scroll.create(TableCell.blotName, {
          row: id,
          tbalign,
        });
        const cellLine = this.scroll.create(TableCellLine.blotName, {
          row: id,
          cell: cellId(),
          tbalign,
        });
        cell.appendChild(cellLine);
        if (i === rowIndex && j === colIndex) {
          // eslint-disable-next-line no-continue
          continue;
        }
        row.domNode.insertBefore(cell.domNode, row.domNode.cells[j]);
      }
    }
  }

  getMaxRows() {
    const { rows } = this.domNode;
    let maxLen = 1;
    for (let i = 0; i < rows.length; i++) {
      let curMax = 1;
      const { cells } = rows[i];
      for (let j = 0; j < cells[j].length; j++) {
        curMax = Math.max(cells[j].rowSpan, curMax);
      }
      maxLen = Math.max(curMax + i, maxLen);
    }
    return maxLen;
  }

  getMaxCols() {
    const { rows } = this.domNode;
    let maxLen = 0;
    const cellRows = {};
    for (let i = 0; i < rows.length; i++) {
      const { cells } = rows[i];
      let cellsNum = 0;
      for (let j = 0; j < cells.length; j++) {
        const cj = cells[j];
        cellsNum += cj.colSpan || 1;
        if (cj.rowSpan && cj.rowSpan > 1) {
          for (let k = 1; k < cj.rowSpan; k++) {
            if (!cellRows[`row_${i + k}`]) {
              cellRows[`row_${i + k}`] = cj.colSpan || 1;
            } else {
              cellRows[`row_${i + k}`]++;
            }
          }
        }
      }
      cellsNum += cellRows[`row_${i}`] || 0;
      maxLen = Math.max(cellsNum, maxLen);
    }
    return maxLen;
  }

  updateIndexTable() {
    this.indexTable = [];
    const { rows } = this.domNode;
    const rowsNum = this.getMaxRows();
    const colsNum = this.getMaxCols();
    this.rowsNum = rowsNum;
    this.colsNum = colsNum;
    for (let i = 0; i < rows.length; i++) {
      this.indexTable[i] = new Array(colsNum);
    }
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const { cells } = rows[rowIndex];
      for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        const cell = cells[cellIndex];
        if (cell.rowSpan > rowsNum) {
          cell.rowSpan = rowsNum;
        }

        let colIndex = cellIndex;
        while (this.indexTable[rowIndex][colIndex]) colIndex++;
        const { rowSpan, colSpan } = cell;
        for (let j = 0; j < rowSpan; j++) {
          for (let k = 0; k < colSpan; k++) {
            this.indexTable[rowIndex + j][colIndex + k] = {
              rowIndex,
              cellIndex,
              colIndex,
              rowSpan,
              colSpan,
            };
          }
        }
      }
    }
  }

  getCellInfo(cell) {
    if (!cell) return {};
    const { cellIndex } = cell;
    const { rowIndex } = cell.parentNode;
    const rowInfo = this.indexTable[rowIndex];
    const numCols = this.colsNum;
    for (let colIndex = cellIndex; colIndex < numCols; colIndex++) {
      const cellInfo = rowInfo[colIndex];
      if (cellInfo.rowIndex === rowIndex && cellInfo.cellIndex === cellIndex) {
        return cellInfo;
      }
    }
    return {};
  }

  getCellsRange(cellA, cellB) {
    const cellAInfo = this.getCellInfo(cellA);
    if (cellA === cellB) {
      return {
        beginRowIndex: cellAInfo.rowIndex,
        beginColIndex: cellAInfo.colIndex,
        endRowIndex: cellAInfo.rowIndex + cellAInfo.rowSpan - 1,
        endColIndex: cellAInfo.colIndex + cellAInfo.colSpan - 1,
      };
    }
    const cellBInfo = this.getCellInfo(cellB);
    // 计算TableRange的四个边
    const beginRowIndex = Math.min(cellAInfo.rowIndex, cellBInfo.rowIndex);
    const beginColIndex = Math.min(cellAInfo.colIndex, cellBInfo.colIndex);
    const endRowIndex = Math.max(
      cellAInfo.rowIndex + cellAInfo.rowSpan - 1,
      cellBInfo.rowIndex + cellBInfo.rowSpan - 1,
    );
    const endColIndex = Math.max(
      cellAInfo.colIndex + cellAInfo.colSpan - 1,
      cellBInfo.colIndex + cellBInfo.colSpan - 1,
    );

    return this.checkRange(
      beginRowIndex,
      beginColIndex,
      endRowIndex,
      endColIndex,
    );
  }

  checkRange(beginRowIndex, beginColIndex, endRowIndex, endColIndex) {
    let tmpBeginRowIndex = beginRowIndex;
    let tmpBeginColIndex = beginColIndex;
    let tmpEndRowIndex = endRowIndex;
    let tmpEndColIndex = endColIndex;
    let cellInfo;
    let colIndex;
    let rowIndex;
    // 通过indexTable检查是否存在超出TableRange上边界的情况
    if (beginRowIndex > 0) {
      for (colIndex = beginColIndex; colIndex < endColIndex; colIndex++) {
        cellInfo = this.indexTable[beginRowIndex][colIndex];
        ({ rowIndex } = cellInfo);
        if (rowIndex < beginRowIndex) {
          tmpBeginRowIndex = Math.min(rowIndex, tmpBeginRowIndex);
        }
      }
    }
    // 通过indexTable检查是否存在超出TableRange右边界的情况
    if (endColIndex < this.colsNum) {
      for (rowIndex = beginRowIndex; rowIndex < endRowIndex; rowIndex++) {
        cellInfo = this.indexTable[rowIndex][endColIndex];
        colIndex = cellInfo.colIndex + cellInfo.colSpan - 1;
        if (colIndex > endColIndex) {
          tmpEndColIndex = Math.max(colIndex, tmpEndColIndex);
        }
      }
    }
    // 检查是否有超出TableRange下边界的情况
    if (endRowIndex < this.rowsNum) {
      for (colIndex = beginColIndex; colIndex < endColIndex; colIndex++) {
        cellInfo = this.indexTable[endRowIndex][colIndex];
        rowIndex = cellInfo.rowIndex + cellInfo.rowSpan - 1;
        if (rowIndex > endRowIndex) {
          tmpEndRowIndex = Math.max(rowIndex, tmpEndRowIndex);
        }
      }
    }
    // 检查是否有超出TableRange左边界的情况
    if (beginColIndex > 0) {
      for (rowIndex = beginRowIndex; rowIndex < endRowIndex; rowIndex++) {
        cellInfo = this.indexTable[rowIndex][beginColIndex];
        ({ colIndex } = cellInfo);
        if (colIndex < beginColIndex) {
          tmpBeginColIndex = Math.min(cellInfo.colIndex, tmpBeginColIndex);
        }
      }
    }
    // 递归调用直至所有完成所有框选单元格的扩展
    if (
      tmpBeginRowIndex !== beginRowIndex ||
      tmpBeginColIndex !== beginColIndex ||
      tmpEndRowIndex !== endRowIndex ||
      tmpEndColIndex !== endColIndex
    ) {
      return this.checkRange(
        tmpBeginRowIndex,
        tmpBeginColIndex,
        tmpEndRowIndex,
        tmpEndColIndex,
      );
    }
    // 不需要扩展TableRange的情况
    return {
      beginRowIndex,
      beginColIndex,
      endRowIndex,
      endColIndex,
    };
  }

  getCells(range) {
    // 每次获取cells之前必须先清除上次的选择，否则会对后续获取操作造成影响
    const { beginRowIndex, beginColIndex, endRowIndex, endColIndex } = range;
    let cellInfo;
    let rowIndex;
    let colIndex;
    const tdHash = {};
    const returnTds = [];
    for (let i = beginRowIndex; i <= endRowIndex; i++) {
      for (let j = beginColIndex; j <= endColIndex; j++) {
        cellInfo = this.indexTable[i][j];
        ({ rowIndex, colIndex } = cellInfo);
        // 如果Cells里已经包含了此Cell则跳过
        const key = `${rowIndex}|${colIndex}`;
        // eslint-disable-next-line no-continue
        if (tdHash[key]) continue;
        tdHash[key] = 1;
        if (
          rowIndex < i ||
          colIndex < j ||
          rowIndex + cellInfo.rowSpan - 1 > endRowIndex ||
          colIndex + cellInfo.colSpan - 1 > endColIndex
        ) {
          return null;
        }
        returnTds.push(this.getCell(rowIndex, cellInfo.cellIndex));
      }
    }
    return returnTds;
  }

  getCell(rowIndex, cellIndex) {
    return (
      (rowIndex < this.rowsNum &&
        this.rows()[rowIndex].children.at([cellIndex])) ||
      null
    );
  }
}
TableContainer.blotName = 'table-container';
TableContainer.tagName = 'TABLE';

TableContainer.allowedChildren = [TableBody];
TableBody.requiredContainer = TableContainer;

TableBody.allowedChildren = [TableRow];
TableRow.requiredContainer = TableBody;

TableRow.allowedChildren = [TableCell];
TableCell.requiredContainer = TableRow;

TableCell.allowedChildren = [TableCellLine];
TableCellLine.requiredContainer = TableCell;

function rowId() {
  const id = Math.random()
    .toString(36)
    .slice(2, 6);
  return `row-${id}`;
}

function cellId() {
  const id = Math.random()
    .toString(36)
    .slice(2, 6);
  return `cell-${id}`;
}

export {
  TableCellLine,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  rowId,
  cellId,
};
