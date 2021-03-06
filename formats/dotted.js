import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: ['normal'],
};

const DottedClass = new ClassAttributor('dotted', 'tkspec-dotted', config);

export default DottedClass;
