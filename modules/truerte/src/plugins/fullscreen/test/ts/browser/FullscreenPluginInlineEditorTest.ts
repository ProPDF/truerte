import { describe, it } from '@ephox/bedrock-client';
import { TinyHooks } from '@ephox/wrap-mcagar';
import { assert } from 'chai';

import Editor from 'truerte/core/api/Editor';
import FullscreenPlugin from 'truerte/plugins/fullscreen/Plugin';
import LinkPlugin from 'truerte/plugins/link/Plugin';

describe('browser.truerte.plugins.fullscreen.FullScreenPluginInlineEditorTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    inline: true,
    plugins: 'fullscreen link',
    toolbar: 'fullscreen link',
    base_url: '/project/truerte/js/truerte'
  }, [ FullscreenPlugin, LinkPlugin ]);

  it('TBA: Assert isFullscreen api function is present and fullscreen button is absent', () => {
    const editor = hook.editor();
    assert.isFalse(editor.plugins.fullscreen.isFullscreen(), 'should have isFullscreen api function');
    assert.isUndefined(editor.ui.registry.getAll().buttons.fullscreen, 'should not have the fullscreen button');
  });
});
