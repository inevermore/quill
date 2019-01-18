import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: ['normal', 'wavy'],
};

const TkFormatClass = new ClassAttributor(
  'tk-underline',
  'yikespec-underline',
  config,
);

export default TkFormatClass;
