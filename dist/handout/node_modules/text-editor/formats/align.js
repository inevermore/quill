import { ClassAttributor, Scope, StyleAttributor } from 'parchment';

const config = {
  scope: Scope.BLOCK,
  // whitelist: ['left', 'right', 'center'],
};

const AlignClass = new ClassAttributor('align', 'yikespec-align', config);
const AlignStyle = new StyleAttributor('align', 'text-align', config);

export { AlignClass, AlignStyle };
