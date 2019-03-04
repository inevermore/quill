import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.BLOCK,
  whitelist: ['normal'],
};

const TkTextIndentClass = new ClassAttributor(
  'text-indent',
  'tkspec-text-indent',
  config,
);

export default TkTextIndentClass;
