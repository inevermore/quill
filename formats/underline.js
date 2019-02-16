// import TkInline from '../blots/tk-inline';

// class TkUnderline extends TkInline {}

// TkUnderline.blotName = 'underline';
// TkUnderline.className = 'tkspec-underline';
// TkUnderline.whiteList = ['normal', 'wavy'];

// export default TkUnderline;

import { ClassAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: ['normal', 'wavy'],
};

const TkUnderline = new ClassAttributor('underline', 'tkspec-underline', config);

export default TkUnderline;
