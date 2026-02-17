import { describe, it } from '@ephox/bedrock-client';
import { assert } from 'chai';

import * as ExtendingChar from 'truerte/core/text/ExtendingChar';

describe('atomic.truerte.core.text.ExtendingCharTest', () => {
  it('isExtendingChar', () => {
    assert.strictEqual(ExtendingChar.isExtendingChar('a'), false);
    assert.strictEqual(ExtendingChar.isExtendingChar('\u0301'), true);
  });
});
