import Delta from 'quill-delta';
import Quill from '../core/quill';
import Module from '../core/module';
import {
  TableCellLine,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  rowId,
  cellId,
} from '../formats/table';

class Table extends Module {
  static register() {
    Quill.register(TableCellLine);
    Quill.register(TableCell);
    Quill.register(TableRow);
    Quill.register(TableBody);
    Quill.register(TableContainer);
  }

  constructor(...args) {
    super(...args);
    this.listenBalanceCells();
    this.indexTable = [];
    this.quill.theme.addModule('table-action');
  }

  balanceTables() {
    this.quill.scroll.descendants(TableContainer).forEach(table => {
      table.balanceCells();
    });
  }

  deleteColumn() {
    const [table, , cell] = this.getTable();
    if (cell == null) return;
    const { colIndex } = table.getCellInfo(cell.domNode);
    table.deleteColumn(colIndex);
    this.quill.update(Quill.sources.USER);
  }

  deleteRow() {
    const [table, row, cell] = this.getTable();
    if (row == null) return;
    const { rowIndex } = table.getCellInfo(cell.domNode);
    table.deleteRow(rowIndex);
    this.quill.update(Quill.sources.USER);
  }

  deleteTable() {
    const [table] = this.getTable();
    if (table == null) return;
    const offset = table.offset();
    table.remove();
    this.quill.update(Quill.sources.USER);
    this.quill.setSelection(offset, Quill.sources.SILENT);
  }

  getTable(
    range = this.quill.getSelection() || this.quill.selection.savedRange,
  ) {
    if (range == null) return [null, null, null, -1];
    const [cellLine, offset] = this.quill.getLine(range.index);
    if (
      cellLine == null ||
      cellLine.statics.blotName !== TableCellLine.blotName
    ) {
      return [null, null, null, -1];
    }
    const cell = cellLine.parent;
    const row = cell.parent;
    const table = row.parent.parent;
    return [table, row, cell, offset];
  }

  insertColumn(offset) {
    const range = this.quill.getSelection() || this.quill.selection.savedRange;
    const [table, , cell] = this.getTable(range);
    if (cell == null) return;
    const { colIndex, colSpan } = table.getCellInfo(cell.domNode);
    let column = colIndex;
    if (offset) {
      column += colSpan - 1;
    }
    table.insertColumn(column + offset);
    this.quill.update(Quill.sources.USER);
    // let shift = row.rowOffset();
    // if (offset === 0) {
    //   // shift += 1;
    // }
    // this.quill.setSelection(range.index + shift, 1, Quill.sources.SILENT);
  }

  insertColumnLeft() {
    this.insertColumn(0);
  }

  insertColumnRight() {
    this.insertColumn(1);
  }

  insertRow(offset) {
    const range = this.quill.getSelection() || this.quill.selection.savedRange;
    const [table, , cell] = this.getTable(range);
    if (cell == null) return;
    const { rowIndex, rowSpan } = table.getCellInfo(cell.domNode);
    let index = rowIndex;
    if (offset) {
      index += rowSpan - 1;
    }
    table.insertRow(index + offset);
    this.quill.update(Quill.sources.USER);
    // if (offset > 0) {
    //   this.quill.setSelection(range, Quill.sources.SILENT);
    // } else {
    //   this.quill.setSelection(
    //     range.index + row.children.length,
    //     range.length,
    //     Quill.sources.SILENT,
    //   );
    // }
  }

  insertRowAbove() {
    this.insertRow(0);
  }

  insertRowBelow() {
    this.insertRow(1);
  }

  insertTable(rows, columns) {
    const rangeIndex =
      (this.quill.getSelection() && this.quill.getSelection().index) ||
      this.quill.selection.savedRange.index;
    if (rangeIndex == null) return;
    const [line, offset] = this.quill.getLine(rangeIndex);
    const initDelta = new Delta();
    // 非行首
    if (offset !== 0) {
      // 行尾
      if (offset === line.length() - 1) {
        initDelta.retain(rangeIndex + 1);
      } else {
        initDelta.retain(rangeIndex).insert('\n');
      }
    } else {
      initDelta.retain(rangeIndex);
    }
    const delta = new Array(rows).fill(0).reduce(memo => {
      const row = rowId();
      new Array(columns).fill('\n').forEach(col => {
        memo.insert(col, {
          'table-cell-line': { row, cell: cellId() },
        });
      });
      return memo;
    }, initDelta);
    if (offset !== 0 && offset === line.length() - 1) {
      delta.insert('\n');
    }
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(
      offset === 0 ? rangeIndex : rangeIndex + 1,
      Quill.sources.SILENT,
    );
    this.quill.focus();
    this.balanceTables();
  }

  mergeRange(cellsRange) {
    const range = this.quill.getSelection() || this.quill.selection.savedRange;
    const [table] = this.getTable(range);
    const cell = table.mergeRange(cellsRange);
    this.quill.update(Quill.sources.USER);
    // this.quill.focus();

    if (cell.isEmpty()) {
      this.quill.selection.setNativeRange(cell.domNode, 0);
    } else {
      this.quill.selection.setNativeRange(
        cell.domNode,
        0,
        cell.domNode,
        cell.domNode.childNodes.length,
      );
    }
  }

  splitToCells(cell) {
    const range = this.quill.getSelection() || this.quill.selection.savedRange;
    const [table] = this.getTable(range);
    table.splitToCells(cell);
  }

  listenBalanceCells() {
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, mutations => {
      mutations.some(mutation => {
        if (['TD', 'TR', 'TBODY', 'TABLE'].includes(mutation.target.tagName)) {
          this.quill.once(Quill.events.TEXT_CHANGE, (delta, old, source) => {
            if (source !== Quill.sources.USER) return;
            this.balanceTables();
          });
          return true;
        }
        return false;
      });
    });
  }
}

export default Table;
