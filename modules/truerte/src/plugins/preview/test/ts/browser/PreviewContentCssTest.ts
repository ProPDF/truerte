import { describe, it } from '@ephox/bedrock-client';
import { TinyHooks } from '@ephox/wrap-mcagar';
import { assert } from 'chai';

import Editor from 'truerte/core/api/Editor';
import * as IframeContent from 'truerte/plugins/preview/core/IframeContent';
import Plugin from 'truerte/plugins/preview/Plugin';

describe('browser.truerte.plugins.preview.PreviewContentCssTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    plugins: 'preview',
    base_url: '/project/truerte/js/truerte',
    content_css: '/project/truerte/js/truerte/skins/content/default/content.css'
  }, [ Plugin ]);

  const assertIframeHtmlContains = (editor: Editor, text: string) => {
    const actual = IframeContent.getPreviewHtml(editor);
    const regexp = new RegExp(text);

    assert.match(actual, regexp, 'Should be the same html');
  };

  it('TBA: Set content, set content_css_cors and assert link elements. Delete setting and assert crossOrigin attr is removed', () => {
    const editor = hook.editor();
    const contentCssUrl = editor.documentBaseURI.toAbsolute('/project/truerte/js/truerte/skins/content/default/content.css');

    editor.setContent('<p>hello world</p>');
    editor.options.set('content_css_cors', true);
    assertIframeHtmlContains(editor, `<link type="text/css" rel="stylesheet" href="${contentCssUrl}" crossorigin="anonymous">`);
    editor.options.set('content_css_cors', false);
    assertIframeHtmlContains(editor, `<link type="text/css" rel="stylesheet" href="${contentCssUrl}">`);
  });
});
