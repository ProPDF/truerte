import { describe, it } from '@ephox/bedrock-client';
import { SelectorFind } from '@ephox/sugar';
import { TinyAssertions, TinyDom, TinyHooks } from '@ephox/wrap-mcagar';

import Editor from 'truerte/core/api/Editor';

import * as Utils from '../../../../main/ts/textpatterns/utils/Utils';

describe('atomic.truerte.core.util.UtilsTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    base_url: '/project/truerte/js/truerte'
  }, [], true);

  it('Utils.cleanEmptyNodes', () => {
    const editor = hook.editor();
    editor.setContent('<p>a<strong id="tagToClean"> </strong>b</p>');

    const emptyTag = SelectorFind.descendant(TinyDom.body(editor), '#tagToClean').getOrDie().dom;
    Utils.cleanEmptyNodes(editor.dom, emptyTag, (e: Node) => e === editor.dom.getRoot());
    TinyAssertions.assertContent(editor, '<p>a b</p>');
  });
});
