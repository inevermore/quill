import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: ['normal'],
};

const TkStrikeClass = new ClassAttributor(
  'tk-strike',
  'yikespec-strike',
  config,
);

export default TkStrikeClass;
