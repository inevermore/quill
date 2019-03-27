import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: ['normal'],
};

const TkItalicClass = new ClassAttributor('italic', 'tkspec-italic', config);

export default TkItalicClass;
