import Block from '../blots/block';
import Container from '../blots/container';

class TableCell extends Block {
  static create(value) {
    const node = super.create();
    if (value) {
      node.setAttribute('data-row', value.datarow);
      node.setAttribute('rowspan', value.rowspan || 1);
      node.setAttribute('colspan', value.colspan || 1);
      node.setAttribute('tbalign', value.tbalign || '');
    } else {
      node.setAttribute('data-row', tableId());
      node.setAttribute('rowspan', 1);
      node.setAttribute('colspan', 1);
      node.setAttribute('tbalign', '');
    }
    return node;
  }

  static formats(domNode) {
    if (domNode.hasAttribute('data-row')) {
      const tr = domNode.parentNode;
      const table =
        tr.parentNode.tagName === 'TABLE'
          ? tr.parentNode
          : tr.parentNode.parentNode;
      return {
        datarow: domNode.getAttribute('data-row'),
        rowspan: domNode.getAttribute('rowspan') || 1,
        colspan: domNode.getAttribute('colspan') || 1,
        tbalign:
          table.getAttribute('table-align') ||
          table.getAttribute('align') ||
          '',
      };
    }
    return undefined;
  }

  static value(domNode) {
    if (domNode.hasAttribute('data-row')) {
      const tr = domNode.parentNode;
      const table =
        tr.parentNode.tagName === 'TABLE'
          ? tr.parentNode
          : tr.parentNode.parentNode;
      return {
        datarow: domNode.getAttribute('data-row'),
        rowspan: domNode.getAttribute('rowspan') || 1,
        colspan: domNode.getAttribute('colspan') || 1,
        tbalign:
          table.getAttribute('table-align') ||
          table.getAttribute('align') ||
          '',
      };
    }
    return undefined;
  }

  cellOffset() {
    if (this.parent) {
      const { children } = this.parent;
      return children.reduce((sum, child) => {
        if (children.indexOf(this) >= children.indexOf(child)) {
          return sum + child.formats().table.colspan * 1;
        }
        return sum;
      }, -1);
    }
    return -1;
  }

  format(name, value) {
    if (name === TableCell.blotName && value) {
      this.domNode.setAttribute('data-row', value.datarow);
      this.domNode.setAttribute('rowspan', value.rowspan || 1);
      this.domNode.setAttribute('colspan', value.colspan || 1);
      this.domNode.setAttribute('tbalign', value.tbalign || '');
    } else {
      super.format(name, value);
    }
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
        thisHead.table.datarow === thisTail.table.datarow &&
        thisHead.table.datarow === nextHead.table.datarow &&
        thisHead.table.datarow === nextTail.table.datarow
      );
    }
    return false;
  }

  optimize(...args) {
    super.optimize(...args);
    this.children.forEach(child => {
      if (child.next == null) return;
      const childFormats = child.formats();
      const nextFormats = child.next.formats();
      if (childFormats.table.datarow !== nextFormats.table.datarow) {
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
      const { colspan } = TableCell.formats(child.domNode);
      return sum + colspan * 1;
    }, 0);
  }

  getCellByIndex(index) {
    const next = this.children.iterator();
    let cur = next();
    let sum = 0;
    while (cur && sum < index) {
      const { colspan } = TableCell.formats(cur.domNode);
      sum += colspan * 1;
      cur = next();
    }
    return cur;
  }
}
TableRow.blotName = 'table-row';
TableRow.tagName = 'TR';

class TableBody extends Container {}
TableBody.blotName = 'table-body';
TableBody.tagName = 'TBODY';

class TableContainer extends Container {
  static create(value) {
    const domNode = super.create(value);
    Promise.resolve().then(() => {
      const td = domNode.querySelector('td');
      if (td) {
        domNode.setAttribute('table-align', td.getAttribute('tbalign') || '');
      }
    });
    return domNode;
  }

  balanceCells() {
    const rows = this.descendants(TableRow);
    const maxColumns = rows.reduce((max, row) => {
      return Math.max(row.rowLength(), max);
    }, 0);
    rows.forEach(row => {
      new Array(maxColumns - row.rowLength()).fill(0).forEach(() => {
        let value;
        if (row.children.head != null) {
          value = TableCell.formats(row.children.head.domNode);
        }
        const blot = this.scroll.create(TableCell.blotName, value);
        row.appendChild(blot);
        blot.optimize(); // Add break blot
      });
    });
  }

  cells(column) {
    return this.rows().map(row => row.getCellByIndex(column));
  }

  deleteColumn(index) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null) return;
    body.children.forEach(row => {
      const cell = row.getCellByIndex(index);
      if (cell != null) {
        cell.remove();
      }
    });
  }

  insertColumn(index) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null) return;
    body.children.forEach(row => {
      const ref = row.getCellByIndex(index);
      const value = TableCell.formats(row.children.head.domNode);
      const cell = this.scroll.create(TableCell.blotName, value);
      row.insertBefore(cell, ref);
    });
  }

  insertRow(index) {
    const [body] = this.descendant(TableBody);
    if (body == null || body.children.head == null) return;
    const id = tableId();
    const newRow = this.scroll.create(TableRow.blotName);
    const rows = this.descendants(TableRow);
    const value = TableCell.formats(rows[0].children.head.domNode);
    value.datarow = id;
    const maxColumns = rows.reduce((max, row) => {
      return Math.max(row.children.length, max);
    }, 0);
    new Array(maxColumns).fill(0).forEach(() => {
      const cell = this.scroll.create(TableCell.blotName, value);
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

function tableId() {
  const id = Math.random()
    .toString(36)
    .slice(2, 6);
  return `row-${id}`;
}

export { TableCell, TableRow, TableBody, TableContainer, tableId };
