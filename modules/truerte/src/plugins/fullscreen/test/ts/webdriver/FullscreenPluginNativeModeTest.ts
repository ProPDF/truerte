import { RealMouse, Waiter } from '@ephox/agar';
import { before, describe, it } from '@ephox/bedrock-client';
import { TinyHooks } from '@ephox/wrap-mcagar';

import Editor from 'truerte/core/api/Editor';
import { getFullscreenElement } from 'truerte/plugins/fullscreen/core/NativeFullscreen';
import Plugin from 'truerte/plugins/fullscreen/Plugin';

describe('webdriver.truerte.plugins.fullscreen.FullScreenPluginNativeModeTest', () => {
  before(function () {
    if (/HeadlessChrome/.test(window.navigator.userAgent)) {
      this.skip();
    }
  });

  TinyHooks.bddSetup<Editor>({
    plugins: 'fullscreen',
    toolbar: 'fullscreen',
    base_url: '/project/truerte/js/truerte',
    fullscreen_native: true
  }, [ Plugin ]);

  const pIsFullscreen = (fullscreen: boolean) => Waiter.pTryUntilPredicate('Waiting for fullscreen mode to ' + (fullscreen ? 'start' : 'end'), () => {
    if (fullscreen) {
      return getFullscreenElement(document) === document.body;
    } else {
      return getFullscreenElement(document) === null;
    }
  });

  it('TBA: Toggle fullscreen on with real click, check document.fullscreenElement, toggle fullscreen off, check document.fullscreenElement', async () => {
    await pIsFullscreen(false);
    await RealMouse.pClickOn('button[data-mce-name="fullscreen"]');
    await pIsFullscreen(true);
    await RealMouse.pClickOn('button[data-mce-name="fullscreen"]');
    await pIsFullscreen(false);
  });
});
