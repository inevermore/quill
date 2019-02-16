import { StyleAttributor, Scope } from 'parchment';

const config = {
  scope: Scope.BLOCK,
};

const LineHeightStyle = new StyleAttributor(
  'line-height',
  'line-height',
  config,
);

export default LineHeightStyle;
