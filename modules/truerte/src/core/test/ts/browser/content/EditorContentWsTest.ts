import { describe, it } from '@ephox/bedrock-client';
import { McEditor, TinyAssertions } from '@ephox/wrap-mcagar';

import Editor from 'truerte/core/api/Editor';

describe('browser.truerte.core.content.EditorContentWsTest', () => {

  it('Editor initialized on pre element should retain whitespace on get/set content', async () => {
    const editor = await McEditor.pFromHtml<Editor>('<pre>  a  </pre>', {
      inline: true,
      base_url: '/project/truerte/js/truerte'
    });
    TinyAssertions.assertContent(editor, '  a  ');
    editor.setContent('  b  ');
    TinyAssertions.assertContent(editor, '  b  ');
    McEditor.remove(editor);
  });
});
