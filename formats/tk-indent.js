import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.BLOCK,
  whitelist: ['indent'],
};

const IndentClass = new ClassAttributor('tk-indent', 'yikespec-text', config);

export default IndentClass;
