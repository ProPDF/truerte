import { describe, it } from '@ephox/bedrock-client';
import { TinyAssertions, TinyHooks, TinySelections } from '@ephox/wrap-mcagar';

import Editor from 'truerte/core/api/Editor';
import Plugin from 'truerte/plugins/letterspacing/Plugin';

describe('browser.truerte.plugins.letterspacing.CommandsTest', () => {
  const hook = TinyHooks.bddSetup<Editor>({
    plugins: 'letterspacing',
    base_url: '/project/truerte/js/truerte'
  }, [ Plugin ], true);

  it('TINY-XXXX: mceLetterSpacing should apply spacing style to selected text', () => {
    const editor = hook.editor();

    editor.setContent('<p>hello world</p>');
    TinySelections.setSelection(editor, [ 0, 0 ], 0, [ 0, 0 ], 5);
    editor.execCommand('mceLetterSpacing', false, '1.5px');

    TinyAssertions.assertContent(editor, '<p><span style="letter-spacing: 1.5px;">hello</span> world</p>');
  });

  it('TINY-XXXX: mceLetterSpacing should normalize number values to px', () => {
    const editor = hook.editor();

    editor.setContent('<p>hello world</p>');
    TinySelections.setSelection(editor, [ 0, 0 ], 6, [ 0, 0 ], 11);
    editor.execCommand('mceLetterSpacing', false, 2);

    TinyAssertions.assertContent(editor, '<p>hello <span style="letter-spacing: 2px;">world</span></p>');
  });

  it('TINY-XXXX: mceLetterSpacing should ignore invalid values', () => {
    const editor = hook.editor();

    editor.setContent('<p>hello world</p>');
    TinySelections.setSelection(editor, [ 0, 0 ], 0, [ 0, 0 ], 5);
    editor.execCommand('mceLetterSpacing', false, 'invalid-value');

    TinyAssertions.assertContent(editor, '<p>hello world</p>');
  });

  it('TINY-XXXX: mceSetLetterSpacing should apply spacing style to selected text', () => {
    const editor = hook.editor();

    editor.setContent('<p>hello world</p>');
    TinySelections.setSelection(editor, [ 0, 0 ], 6, [ 0, 0 ], 11);
    editor.execCommand('mceSetLetterSpacing', false, '3px');

    TinyAssertions.assertContent(editor, '<p>hello <span style="letter-spacing: 3px;">world</span></p>');
  });
});
