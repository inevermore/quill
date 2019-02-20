import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: ['normal'],
};

const TkBoldClass = new ClassAttributor('bold', 'tkspec-bold', config);

export default TkBoldClass;
