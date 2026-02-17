import { describe, it, before, after } from '@ephox/bedrock-client';
import { TinyHooks, TinySelections } from '@ephox/wrap-mcagar';

import Editor from 'truerte/core/api/Editor';
import * as LinkPluginUtils from 'truerte/plugins/link/core/Utils';
import Plugin from 'truerte/plugins/link/Plugin';

import { TestLinkUi } from '../module/TestLinkUi';

describe('browser.truerte.plugins.link.ImageFigureLinkTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    plugins: 'link',
    toolbar: 'link',
    base_url: '/project/truerte/js/truerte'
  }, [ Plugin ]);

  before(() => {
    TestLinkUi.clearHistory();
  });

  after(() => {
    TestLinkUi.clearHistory();
  });

  it('TBA: Select and link the selection, assert link is present', async () => {
    const editor = hook.editor();
    editor.setContent(
      '<figure class="image">' +
        '<img src="http://moxiecode.cachefly.net/truerte/v9/images/logo.png" />' +
        '<figcaption>TrueRTE</figcaption>' +
      '</figure>'
    );
    TinySelections.setCursor(editor, [ 0 ], 0);
    await TestLinkUi.pInsertLink(editor, 'http://google.com');
    await TestLinkUi.pAssertContentPresence(editor, { 'figure.image > a[href="http://google.com"] > img': 1 });
  });

  it('TBA: Select and unlink the selection, assert link is not present', async () => {
    const editor = hook.editor();
    editor.setContent(
      '<figure class="image">' +
        '<a href="http://google.com"><img src="http://moxiecode.cachefly.net/truerte/v9/images/logo.png" /></a>' +
        '<figcaption>TrueRTE</figcaption>' +
      '</figure>'
    );
    TinySelections.setCursor(editor, [ 0 ], 0);
    LinkPluginUtils.unlink(editor);
    await TestLinkUi.pAssertContentPresence(editor, { 'figure.image > img': 1 });
  });
});
