import { context, describe, it } from '@ephox/bedrock-client';
import { TinyAssertions, TinyHooks } from '@ephox/wrap-mcagar';

import Editor from 'truerte/core/api/Editor';

describe('browser.truerte.core.paste.UnsanitizedPasteTest', () => {
  const unsanitizedHtml = '<p id="action">XSS</p>';
  const sanitizedHtml = '<p>XSS</p>';
  const testPaste = (editor: Editor, content: string, expected: string) => {
    editor.setContent('');
    editor.execCommand('mceInsertClipboardContent', false, { html: content });
    TinyAssertions.assertContent(editor, expected);
  };

  context('TINY-9600: xss_sanitization: true', () => {
    const hook = TinyHooks.bddSetupLight<Editor>({
      base_url: '/project/truerte/js/truerte',
      xss_sanitization: true
    }, []);

    it('should sanitize pasted content', () => {
      const editor = hook.editor();
      testPaste(editor, unsanitizedHtml, sanitizedHtml);
    });
  });

  context('TINY-9600: xss_sanitization: false', () => {
    const hook = TinyHooks.bddSetupLight<Editor>({
      base_url: '/project/truerte/js/truerte',
      xss_sanitization: false
    }, []);

    it('should not sanitize pasted content', () => {
      const editor = hook.editor();
      testPaste(editor, unsanitizedHtml, unsanitizedHtml);
    });
  });
});
