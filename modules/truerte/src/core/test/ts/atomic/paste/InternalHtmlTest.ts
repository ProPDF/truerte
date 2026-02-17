import { describe, it } from '@ephox/bedrock-client';
import { assert } from 'chai';

import * as InternalHtml from 'truerte/core/paste/InternalHtml';

describe('atomic.truerte.core.paste.InternalHtmlTest', () => {
  it('mark', () => {
    assert.equal(InternalHtml.mark('abc'), '<!-- x-truerte/html -->abc');
  });

  it('unmark', () => {
    assert.equal(InternalHtml.unmark('<!-- x-truerte/html -->abc'), 'abc');
    assert.equal(InternalHtml.unmark('abc<!-- x-truerte/html -->'), 'abc');
  });

  it('isMarked', () => {
    assert.isTrue(InternalHtml.isMarked('<!-- x-truerte/html -->abc'));
    assert.isTrue(InternalHtml.isMarked('abc<!-- x-truerte/html -->'));
    assert.isFalse(InternalHtml.isMarked('abc'));
  });

  it('internalHtmlMime', () => {
    assert.equal(InternalHtml.internalHtmlMime(), 'x-truerte/html');
  });
});
