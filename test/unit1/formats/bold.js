import Editor from '../../../index';
// import Scroll from '../../../blots/scroll';
// import Editor from '../../../core/editor';
import Selection from '../../../core/selection';

describe('Bold', function() {
  it('add', function() {
    const [editor, selection] = this.initialize(
      [Editor, Selection],
      '<p>0123</p>',
    );
    selection.setRange({
      index: 1,
      length: 2,
    });
    editor.setSelection(1, 2);
    editor.format('align', 'center');
    expect(editor.quill.scroll.domNode).toEqualHTML(
      '<p class="tkspec-align-center">0123</p>',
    );
  });
});
