import { describe, it } from '@ephox/bedrock-client';
import { TinyAssertions, TinyHooks, TinySelections } from '@ephox/wrap-mcagar';

import Editor from 'truerte/core/api/Editor';
import Plugin from 'truerte/plugins/casechange/Plugin';

describe('browser.truerte.plugins.casechange.CommandsTest', () => {
  const hook = TinyHooks.bddSetup<Editor>({
    plugins: 'casechange',
    base_url: '/project/truerte/js/truerte'
  }, [ Plugin ], true);

  it('TINY-XXXX: mceUpperCase should uppercase selected text only', () => {
    const editor = hook.editor();

    editor.setContent('<p>hello world</p>');
    TinySelections.setSelection(editor, [ 0, 0 ], 0, [ 0, 0 ], 5);
    editor.execCommand('mceUpperCase');

    TinyAssertions.assertContent(editor, '<p>HELLO world</p>');
  });

  it('TINY-XXXX: mceLowerCase should lowercase selected text only', () => {
    const editor = hook.editor();

    editor.setContent('<p>HeLLo WORLD</p>');
    TinySelections.setSelection(editor, [ 0, 0 ], 6, [ 0, 0 ], 11);
    editor.execCommand('mceLowerCase');

    TinyAssertions.assertContent(editor, '<p>HeLLo world</p>');
  });

  it('TINY-XXXX: mceTitleCase should transform selected text across inline elements', () => {
    const editor = hook.editor();

    editor.setContent('<p><em>hELLo</em> <strong>wORLD</strong></p>');
    editor.selection.select(editor.getBody().firstChild as HTMLElement, true);
    editor.execCommand('mceTitleCase');

    TinyAssertions.assertContent(editor, '<p><em>Hello</em> <strong>World</strong></p>');
  });

  it('TINY-XXXX: mceSetTextCase should handle lowercase/uppercase/titlecase', () => {
    const editor = hook.editor();

    editor.setContent('<p>hELLo wORLD</p>');
    TinySelections.setSelection(editor, [ 0, 0 ], 0, [ 0, 0 ], 11);
    editor.execCommand('mceSetTextCase', false, 'lowercase');
    TinyAssertions.assertContent(editor, '<p>hello world</p>');

    editor.execCommand('mceSetTextCase', false, 'uppercase');
    TinyAssertions.assertContent(editor, '<p>HELLO WORLD</p>');

    editor.execCommand('mceSetTextCase', false, 'titlecase');
    TinyAssertions.assertContent(editor, '<p>Hello World</p>');
  });

  it('TINY-XXXX: commands should not change content when selection is collapsed', () => {
    const editor = hook.editor();

    editor.setContent('<p>hello</p>');
    TinySelections.setCursor(editor, [ 0, 0 ], 2);
    editor.execCommand('mceUpperCase');

    TinyAssertions.assertContent(editor, '<p>hello</p>');
  });
});
