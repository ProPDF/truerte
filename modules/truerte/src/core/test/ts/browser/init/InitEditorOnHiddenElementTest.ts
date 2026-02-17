import { describe, it } from '@ephox/bedrock-client';
import { McEditor } from '@ephox/wrap-mcagar';

import Editor from 'truerte/core/api/Editor';

describe('browser.truerte.core.init.InitEditorOnHiddenElementTest', () => {

  // Firefox specific test, errors were thrown when the editor was initialised on hidden element.
  it('editor initializes successfully', async () => {
    const editor = await McEditor.pFromHtml<Editor>('<textarea style="display:none;"></textarea>', {
      base_url: '/project/truerte/js/truerte'
    });
    editor.focus();
    McEditor.remove(editor);
  });
});
