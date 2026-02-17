import { describe, it } from '@ephox/bedrock-client';
import { TinyHooks } from '@ephox/wrap-mcagar';
import { assert } from 'chai';

import Editor from 'truerte/core/api/Editor';
import { getText } from 'truerte/plugins/wordcount/core/GetText';
import Plugin from 'truerte/plugins/wordcount/Plugin';

describe('browser.truerte.plugins.wordcount.GetTextTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    plugins: 'wordcount',
    base_url: '/project/truerte/js/truerte'
  }, [ Plugin ]);

  const assertGetText = (node: Node, expected: string[]) => {
    const editor = hook.editor();
    const actual = getText(node, editor.schema);
    assert.deepEqual(actual, expected, 'should be the same');
  };

  it('getText', () => {
    const editor = hook.editor();
    const c = (html: string) => editor.dom.create('div', {}, html);

    assertGetText(c('<p></p>'), []);
    assertGetText(c('<p>a b</p>'), [ 'a b' ]);
    assertGetText(c('<p>a&nbsp;b</p>'), [ 'a\u00a0b' ]);
    assertGetText(c('<p>a\uFEFFb</p>'), [ 'ab' ]);
    assertGetText(c('<p><span>a</span> b</p>'), [ 'a b' ]);
    assertGetText(c('<p>a</p><p>b</p>'), [ 'a', 'b' ]);
    assertGetText(c('<p>a<br>b</p>'), [ 'a', 'b' ]);
  });
});
