import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.BLOCK,
  whitelist: ['normal'],
};

const TableDiagonal = new ClassAttributor(
  'table-diagonal',
  'tkspec-table-diagonal',
  config,
);

export default TableDiagonal;
