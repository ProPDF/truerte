import { describe, it } from '@ephox/bedrock-client';
import { TinyHooks } from '@ephox/wrap-mcagar';
import { assert } from 'chai';

import Editor from 'truerte/core/api/Editor';
import { EmojiEntry } from 'truerte/plugins/emoticons/core/EmojiDatabase';
import Plugin from 'truerte/plugins/emoticons/Plugin';

describe('browser.truerte.plugins.emoticons.EmoticonsPluginTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    plugins: 'emoticons',
    toolbar: 'emoticons',
    base_url: '/project/truerte/js/truerte',
    emoticons_database_url: '/project/truerte/src/plugins/emoticons/main/js/emojis.js'
  }, [ Plugin ], true);

  it('TINY-10572: The plugin successfully exports the promise function that gives emojis', async () => {
    const editor = hook.editor();
    await editor.plugins.emoticons.getAllEmojis().then((result: EmojiEntry[]) => assert.isArray(result));
  });
});
