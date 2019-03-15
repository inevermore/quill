import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.BLOCK,
  whitelist: ['normal'],
};

const ParagraphBottomSpaceClass = new ClassAttributor(
  'paragraph-bottom-space',
  'tkspec-paragraph-bottom-space',
  config,
);

export default ParagraphBottomSpaceClass;
