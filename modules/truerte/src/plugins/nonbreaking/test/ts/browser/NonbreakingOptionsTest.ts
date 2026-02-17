import { describe, it } from '@ephox/bedrock-client';
import { assert } from 'chai';

import Editor from 'truerte/core/api/Editor';
import EditorManager from 'truerte/core/api/EditorManager';
import * as Options from 'truerte/plugins/nonbreaking/api/Options';

describe('browser.truerte.plugins.nonbreaking.NonbreakingOptionsTest', () => {
  it('TBA: Should be 0 as default', () => {
    const editor = new Editor('x', {}, EditorManager);
    Options.register(editor);
    assert.equal(Options.getKeyboardSpaces(editor), 0);
  });

  it('TBA: Should return 3 if set to true', () => {
    const editor = new Editor('x', { nonbreaking_force_tab: true }, EditorManager);
    Options.register(editor);
    assert.equal(Options.getKeyboardSpaces(editor), 3);
  });

  it('TBA: Should return 0 if set to false', () => {
    const editor = new Editor('x', { nonbreaking_force_tab: false }, EditorManager);
    Options.register(editor);
    assert.equal(Options.getKeyboardSpaces(editor), 0);
  });

  it('TBA: Should return number if set', () => {
    const editor = new Editor('x', { nonbreaking_force_tab: 4 }, EditorManager);
    Options.register(editor);
    assert.equal(Options.getKeyboardSpaces(editor), 4);
  });
});
