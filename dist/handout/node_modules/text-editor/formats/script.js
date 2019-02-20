import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  // whitelist: ['sub', 'super'],
};

const ScriptClass = new ClassAttributor('script', 'tkspec-script', config);

export default ScriptClass;
