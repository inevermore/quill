import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  // whitelist: ['normal', 'wavy'],
};

const Underline = new ClassAttributor('underline', 'tkspec-underline', config);

export default Underline;
