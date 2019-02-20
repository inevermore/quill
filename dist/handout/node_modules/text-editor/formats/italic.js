// import TkInline from '../blots/tk-inline';

// class TkItalic extends TkInline {}

// TkItalic.blotName = 'italic';
// TkItalic.className = 'tkspec-italic';
// TkItalic.whiteList = ['normal'];

// export default TkItalic;
import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: ['normal'],
};

const TkItalicClass = new ClassAttributor('italic', 'tkspec-italic', config);

export default TkItalicClass;
