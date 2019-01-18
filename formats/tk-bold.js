import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: ['normal'],
};

const TkBoldClass = new ClassAttributor('tk-bold', 'yikespec-bold', config);

export default TkBoldClass;
