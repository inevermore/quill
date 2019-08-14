import constant from './constant';
import { TableCellLine } from '../formats/table';

export default [
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
      handler(table) {
        table.mergeRange(this.cellsRange);
        this.clearSelected();
      },
    },
    {
      id: 'unmerge-cells',
      title: '取消合并',
      handler(table) {
        const [, , cell] = table.getTable();
        table.splitToCells(cell);
      },
    },
  ],
];

function alignTable(table, align) {
  const [tableContainer] = table.getTable();
  tableContainer.domNode.setAttribute('table-align', align);
  const lines = tableContainer.descendants(TableCellLine);
  lines.forEach(line => {
    line.format('tbalign', align);
    line.optimize();
  });
}
