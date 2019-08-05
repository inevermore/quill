import Block from '../blots/block';
import Container from '../blots/container';
import { AlignClass } from './align';
import constant from '../config/constant';

const CELL_IDENTITY_KEYS = ['row', 'cell'];
const CELL_ATTRIBUTES = ['rowspan', 'colspan', 'diagonal'];
const CELL_DEFAULT = {
  rowspan: 1,
  colspan: 1,
  tbalign: '',
  diagonal: '',
};
const TABLE_ATTRIBUTES = ['tbalign'];
class TableCellLine extends Block {
  static create(value) {
    const node = super.create(value);

    CELL_IDENTITY_KEYS.forEach(key => {
      const identityMaker = key === 'row' ? rowId : cellId;
      node.setAttribute(`data-${key}`, value[key] || identityMaker());
    });

    CELL_ATTRIBUTES.concat(TABLE_ATTRIBUTES).forEach(attrName => {
      node.setAttribute(
        `data-${attrName}`,
        value[attrName] || CELL_DEFAULT[attrName],
      );
    });

    AlignClass.add(node, AlignClass.value(node) || 'center');

    return node;
  }

  static formats(domNode) {
    const formats = CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS)
      .concat([TABLE_ATTRIBUTES])
      .reduce((format, attribute) => {
        if (domNode.hasAttribute(`data-${attribute}`)) {
          format[attribute] = domNode.getAttribute(`data-${attribute}`) || '';
        }
        return format;
      }, {});
    formats.align = AlignClass.value(domNode) || 'center';
    return formats;
  }

  format(name, value) {
    if (
      CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS)
        .concat(TABLE_ATTRIBUTES)
        .indexOf(name) > -1
    ) {
      if (value) {
        this.domNode.setAttribute(`data-${name}`, value);
      } else {
        this.domNode.removeAttribute(`data-${name}`);
      }
    } else {
      super.format(name, value);
    }
  }

  optimize(context) {
    // cover shadowBlot's wrap call, pass params parentBlot initialize
    // needed
    const {
      row,
      cell,
      rowspan,
      colspan,
      tbalign,
      diagonal,
    } = TableCellLine.formats(this.domNode);
    const formats = TableCellLine.formats(this.domNode);
    if (this.statics.requiredContainer) {
      if (!(this.parent instanceof this.statics.requiredContainer)) {
        this.wrap(this.statics.requiredContainer.blotName, {
          cell,
          row,
          colspan,
          rowspan,
          tbalign,
          diagonal,
        });
      } else if (
        formats.row !== this.parent.formats().row ||
        formats.tbalign !== this.parent.formats().tbalign ||
        formats.diagonal !== this.parent.formats().diagonal
      ) {
        this.parent.domNode.dataset.row = formats.row;
        this.parent.domNode.dataset.tbalign = formats.tbalign;
        if (formats.diagonal === 'normal') {
          this.parent.domNode.classList.add(constant.tableDiagonalClass);
        }
      }
    }
    super.optimize(context);
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
    node.setAttribute('data-row', value.row);
    node.setAttribute('rowspan', value.rowspan);
    node.setAttribute('colspan', value.colspan);
    node.setAttribute('data-tbalign', value.tbalign || '');
    if (value.diagonal === 'normal') {
      node.classList.add(constant.tableDiagonalClass);
    }
    return node;
  }

  cellOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this);
    }
    return -1;
  }

  formats() {
    const formats = {};

    if (this.domNode.hasAttribute('data-row')) {
      formats.row = this.domNode.dataset.row;
    }

    formats.tbalign = this.domNode.dataset.tbalign || '';

    return CELL_ATTRIBUTES.reduce((prev, attribute) => {
      if (this.domNode.hasAttribute(attribute)) {
        prev[attribute] = this.domNode.getAttribute(attribute);
      }

      return prev;
    }, formats);
  }

  optimize(context) {
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
      this.parent.domNode.dataset.tbalign = tbalign;
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
    super.optimize(context);
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
}
TableCell.blotName = 'table';
TableCell.tagName = 'TD';

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

  optimize() {
    // optimize function of ShadowBlot
    const { tbalign } = this.formats();
    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName, { tbalign });
    } else if (tbalign !== this.parent.domNode.dataset.tbalign) {
      this.parent.domNode.dataset.tbalign = tbalign;
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
        // We might be able to merge with prev now
        if (this.prev) {
          this.prev.optimize();
        }
      }
    });

    // this.enforceAllowedChildren();

    // optimize function of ContainerBlot
    if (this.children.length > 0 && this.next != null && this.checkMerge()) {
      this.next.moveChildren(this);
      this.next.remove();
    }
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

  optimize(context) {
    const { tbalign } = this.domNode.dataset;

    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName, {
        tbalign,
      });
    } else if (tbalign !== this.parent.domNode.getAttribute('table-align')) {
      this.parent.domNode.setAttribute('table-align', tbalign || '');
    }
    super.optimize(context);
  }
}
TableBody.blotName = 'table-body';
TableBody.tagName = 'TBODY';

class TableContainer extends Container {
  static create(value) {
    const node = super.create(value);
    if (value.tbalign) {
      node.dataset.tbalign = value.tbalign;
    }
    return node;
  }

  balanceCells() {
    // const rows = this.descendants(TableRow);
    // const maxColumns = rows.reduce((max, row) => {
    //   return Math.max(row.rowLength(), max);
    // }, 0);
    // rows.forEach(row => {
    //   new Array(maxColumns - row.rowLength()).fill(0).forEach(() => {
    //     let value;
    //     if (row.children.head != null) {
    //       value = TableCell.formats(row.children.head.domNode);
    //     }
    //     const blot = this.scroll.create(TableCell.blotName, value);
    //     row.appendChild(blot);
    //     blot.optimize(); // Add break blot
    //   });
    // });
  }

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
