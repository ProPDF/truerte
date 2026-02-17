import { describe, it } from '@ephox/bedrock-client';
import { TinyAssertions, TinyHooks, TinySelections } from '@ephox/wrap-mcagar';

import Editor from 'truerte/core/api/Editor';
import Plugin from 'truerte/plugins/paragraphspacing/Plugin';

describe('browser.truerte.plugins.paragraphspacing.CommandsTest', () => {
  const hook = TinyHooks.bddSetup<Editor>({
    plugins: 'paragraphspacing',
    base_url: '/project/truerte/js/truerte',
    content_style: 'p { margin-top: 0; margin-bottom: 0; }',
    paragraphspacing_step: 10
  }, [ Plugin ], true);

  it('TINY-XXXX: mceParagraphSpacingAddBefore should add spacing to current paragraph', () => {
    const editor = hook.editor();

    editor.setContent('<p>alpha</p><p>beta</p>');
    TinySelections.setCursor(editor, [ 1, 0 ], 2);
    editor.execCommand('mceParagraphSpacingAddBefore');

    TinyAssertions.assertContent(editor, '<p>alpha</p><p style="margin-top: 10px;">beta</p>');
  });

  it('TINY-XXXX: mceParagraphSpacingAddAfter should add spacing to selected paragraphs', () => {
    const editor = hook.editor();

    editor.setContent('<p>alpha</p><p>beta</p>');
    TinySelections.setSelection(editor, [ 0, 0 ], 0, [ 1, 0 ], 4);
    editor.execCommand('mceParagraphSpacingAddAfter');

    TinyAssertions.assertContent(editor, '<p style="margin-bottom: 10px;">alpha</p><p style="margin-bottom: 10px;">beta</p>');
  });

  it('TINY-XXXX: mceParagraphSpacingRemoveBefore should clear top spacing from current paragraph', () => {
    const editor = hook.editor();

    editor.setContent('<p style="margin-top: 20px;">alpha</p><p>beta</p>');
    TinySelections.setCursor(editor, [ 0, 0 ], 1);
    editor.execCommand('mceParagraphSpacingRemoveBefore');

    TinyAssertions.assertContent(editor, '<p style="margin-top: 0px;">alpha</p><p>beta</p>');
  });

  it('TINY-XXXX: mceParagraphSpacingRemoveAfter should clamp bottom spacing at zero', () => {
    const editor = hook.editor();

    editor.setContent('<p style="margin-bottom: 5px;">alpha</p><p>beta</p>');
    TinySelections.setCursor(editor, [ 0, 0 ], 1);
    editor.execCommand('mceParagraphSpacingRemoveAfter');

    TinyAssertions.assertContent(editor, '<p style="margin-bottom: 0px;">alpha</p><p>beta</p>');
  });
});
