import { after, before, describe, it } from '@ephox/bedrock-client';
import { TinyHooks } from '@ephox/wrap-mcagar';
import { assert } from 'chai';

import Editor from 'truerte/core/api/Editor';
import EditorManager from 'truerte/core/api/EditorManager';
import { EditorEvent } from 'truerte/core/api/util/EventDispatcher';

describe('Init events order test', () => {
  const events: string[] = [];

  const addEvent = (evt: EditorEvent<{}>) => {
    events.push(evt.type);
  };

  before(() => {
    EditorManager.on('setupeditor addeditor', addEvent);
  });

  TinyHooks.bddSetupLight<Editor>({
    base_url: '/project/truerte/js/truerte',
    setup: (editor: Editor) => {
      editor.on('preinit addeditor scriptsloaded init visualaid loadcontent beforesetcontent setcontent postrender', addEvent);
    }
  }, []);

  after(() => {
    EditorManager.off('setupeditor addeditor', addEvent);
  });

  it('Event order during init', () => {
    assert.deepEqual(events, [
      'setupeditor',
      'addeditor',
      'scriptsloaded',
      'preinit',
      'postrender',
      'beforesetcontent',
      'setcontent',
      'visualaid',
      'loadcontent',
      'init'
    ], 'Should be expected order of events');
  });
});
