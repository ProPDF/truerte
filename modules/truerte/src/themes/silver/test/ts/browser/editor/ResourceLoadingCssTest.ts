import { describe, it } from '@ephox/bedrock-client';
import { McEditor, TinyDom } from '@ephox/mcagar';
import { Css } from '@ephox/sugar';
import { assert } from 'chai';

import Editor from 'truerte/core/api/Editor';
import { truerte } from 'truerte/core/api/Truerte';

describe('browser.truerte.themes.silver.editor.ResourceLoadingCssTest', () => {
  const pGetEditor = () =>
    McEditor.pFromSettings<Editor>({
      base_url: '/project/truerte/js/truerte',
    });

  it('TINY-10378: No extra resource added', async () => {
    const editor = await pGetEditor();
    assert.equal(Css.get(TinyDom.container(editor), 'background-color'), 'rgba(0, 0, 0, 0)');
    McEditor.remove(editor);
  });

  it('TINY-10378: A resource is added, but it is not relevant to our skins', async () => {
    truerte.Resource.add('key', 'no valuable data here');
    const editor = await pGetEditor();
    assert.equal(Css.get(TinyDom.container(editor), 'background-color'), 'rgba(0, 0, 0, 0)');
    truerte.Resource.unload('key');
    McEditor.remove(editor);
  });

  it('TINY-10378: A resource is added, and it is relevant to our skins', async () => {
    truerte.Resource.add('ui/default/skin.css', '* {background-color: red !important;}');
    const editor = await pGetEditor();
    assert.equal(Css.get(TinyDom.container(editor), 'background-color'), 'rgb(255, 0, 0)');
    truerte.Resource.unload('ui/default/skin.css');
    McEditor.remove(editor);

    // confidence check that subsequent editor aren't also red.
    const editor2 = await pGetEditor();
    assert.equal(Css.get(TinyDom.container(editor2), 'background-color'), 'rgba(0, 0, 0, 0)');
    McEditor.remove(editor2);
  });
});
