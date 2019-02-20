import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.BLOCK,
  whitelist: ['normal'],
};

const IndentClass = new ClassAttributor('indent', 'tkspec-indent', config);

export default IndentClass;
