import Editor from '../../../index';

describe('Bold', function() {
  it('optimize and merge', function() {
    const editor = this.initialize(
      Editor,
      '<p><strong>a</strong><b>b</b><strong>c</strong></p>',
    );
    expect(editor.quill.root).toEqualHTML(
      '<p><span class="tkspec-bold-normal">abc</span></p>',
    );
  });
});
