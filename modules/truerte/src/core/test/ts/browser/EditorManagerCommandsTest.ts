import { after, afterEach, before, describe, it } from '@ephox/bedrock-client';
import { Arr } from '@ephox/katamari';
import { assert } from 'chai';

import 'truerte';
import Editor from 'truerte/core/api/Editor';
import EditorManager from 'truerte/core/api/EditorManager';
import Theme from 'truerte/themes/silver/Theme';

import * as ViewBlock from '../module/test/ViewBlock';

describe('browser.truerte.core.EditorManagerCommandsTest', () => {
  const viewBlock = ViewBlock.bddSetup();

  before(() => {
    Theme();
    EditorManager._setBaseUrl('/project/truerte/js/truerte');
  });

  after(() => {
    EditorManager.remove();
  });

  afterEach((done) => {
    setTimeout(() => {
      EditorManager.remove();
      done();
    }, 0);
  });

  Arr.each([
    { label: 'index', value: 0 },
    { label: 'id', value: 'ed_1' },
    { label: 'object with index', value: { index: 0 }},
    { label: 'object with id', value: { id: 'ed_1' }}
  ], (test) => {
    it(`mceToggleEditor (${test.label})`, (done) => {
      viewBlock.update('<textarea id="ed_1" class="truerte"></textarea>');
      EditorManager.init({
        selector: 'textarea.truerte',
        init_instance_callback: (editor1) => {
          assert.isFalse(editor1.isHidden(), 'editor should be visible');
          EditorManager.execCommand('mceToggleEditor', false, test.value);
          assert.isTrue(editor1.isHidden(), 'editor should be hidden');
          EditorManager.execCommand('mceToggleEditor', false, test.value);
          assert.isFalse(editor1.isHidden(), 'editor should be visible');
          done();
        }
      });
    });

    it(`mceRemoveEditor (${test.label})`, (done) => {
      viewBlock.update('<textarea id="ed_1" class="truerte"></textarea>');
      EditorManager.init({
        selector: 'textarea.truerte',
        init_instance_callback: (_editor1) => {
          assert.lengthOf(EditorManager.get(), 1);
          EditorManager.execCommand('mceRemoveEditor', false, test.value);
          assert.lengthOf(EditorManager.get(), 0);
          done();
        }
      });
    });
  });

  it('mceAddEditor', (done) => {
    viewBlock.update('<textarea id="ed_1" class="truerte"></textarea><textarea id="ed_2" class="truerte"></textarea>');
    EditorManager.init({
      selector: 'textarea#ed_1',
      init_instance_callback: (_editor1) => {
        assert.lengthOf(EditorManager.get(), 1);
        assert.isFalse(EditorManager.get('ed_1')?.mode.isReadOnly());
        EditorManager.execCommand('mceAddEditor', false, {
          id: 'ed_2',
          options: {
            readonly: true,
            init_instance_callback: (editor2: Editor) => {
              assert.lengthOf(EditorManager.get(), 2);
              assert.isTrue(editor2.mode.isReadOnly());
              done();
            }
          }
        });
      }
    });
  });
});
