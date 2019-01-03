import { ClassAttributor, Scope, StyleAttributor } from 'parchment';

class DottedAttributor extends StyleAttributor {
  value() {
    return 'dotted underline';
  }
}

const DottedClass = new ClassAttributor('dotted', 'ql-dotted', {
  scope: Scope.INLINE,
});
const DottedStyle = new DottedAttributor('dotted', 'text-decoration', {
  scope: Scope.INLINE,
});

export { DottedClass, DottedStyle };
