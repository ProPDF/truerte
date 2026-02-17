import { describe, it } from '@ephox/bedrock-client';
import { TinyHooks, TinyUiActions } from '@ephox/wrap-mcagar';

import Plugin from 'truerte/plugins/help/Plugin';

import * as PluginAssert from '../module/PluginAssert';
import { selectors } from '../module/Selectors';

describe('browser.truerte.plugins.help.PluginTest', () => {
  const hook = TinyHooks.bddSetupLight({
    plugins: 'help',
    toolbar: 'help',
    base_url: '/project/truerte/js/truerte'
  }, [ Plugin ]);

  it('TBA: Assert Help Plugin list contains Help', async () => {
    const editor = hook.editor();
    TinyUiActions.clickOnToolbar(editor, selectors.toolbarHelpButton);
    await PluginAssert.pAssert(
      'Failed to find `Help` plugin',
      {
        'a:contains("Help")': 1
      },
      selectors.dialog,
      selectors.pluginsTab
    );
  });
});
