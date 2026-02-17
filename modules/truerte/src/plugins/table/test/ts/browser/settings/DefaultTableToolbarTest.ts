import { describe, it } from '@ephox/bedrock-client';
import { SelectorFilter } from '@ephox/sugar';
import { TinyHooks, TinyUiActions } from '@ephox/wrap-mcagar';
import { assert } from 'chai';

import Editor from 'truerte/core/api/Editor';
import Plugin from 'truerte/plugins/table/Plugin';

import * as TableTestUtils from '../../module/test/TableTestUtils';

describe('browser.truerte.plugins.table.DefaultTableToolbarTest', () => {
  const hook = TinyHooks.bddSetupLight<Editor>({
    plugins: 'table',
    base_url: '/project/truerte/js/truerte'
  }, [ Plugin ], true);

  it('test default count of toolbar buttons', async () => {
    const editor = hook.editor();
    editor.setContent('<table><tbody><tr><td>x</td></tr></tbody></table>');
    TableTestUtils.openContextToolbarOn(editor, 'table td', [ 0 ]);
    const toolbar = await TinyUiActions.pWaitForUi(editor, 'div.tox-pop div.tox-toolbar');
    const buttons = SelectorFilter.descendants(toolbar, 'button');
    assert.lengthOf(buttons, 8, 'has correct count');
  });
});
