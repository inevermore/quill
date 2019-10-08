import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  // whitelist: ['normal'],
};

const TkStrikeClass = new ClassAttributor('strike', 'tkspec-strike', config);

export default TkStrikeClass;
