import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.BLOCK,
  whitelist: ['left', 'right', 'center'],
};

const AlignClass = new ClassAttributor('tk-align', 'yikespec-align', config);

export default AlignClass;
