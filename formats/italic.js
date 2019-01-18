import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: ['normal'],
};

const ItalicClass = new ClassAttributor('italic', 'yikespec-italic', config);

export default ItalicClass;
