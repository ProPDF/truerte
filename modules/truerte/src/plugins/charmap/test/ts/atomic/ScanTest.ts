import { describe, it } from '@ephox/bedrock-client';
import { assert } from 'chai';

import { CharMap } from 'truerte/plugins/charmap/core/CharMap';
import * as Scan from 'truerte/plugins/charmap/core/Scan';

describe('atomic.truerte.plugins.charmap.ScanTest', () => {
  const charMap: CharMap = {
    name: 'All',
    characters: [
      [ 36, 'dollar sign' ],
      [ 8364, 'euro sign' ],
      [ 402, 'function / florin' ],
      [ 192, 'A - grave' ],
      [ 224, 'a - grave' ],
      [ 0x1d160, 'Musical Symbol Eighth Note' ]
    ]
  };

  it('scan by charcode', () => {
    assert.deepEqual(Scan.scan(charMap, '$'), [{ value: '$', icon: '$', text: 'dollar sign' }], '$ should match the dollar sign');
    assert.deepEqual(Scan.scan(charMap, 'À'), [{ value: 'À', icon: 'À', text: 'A - grave' }, { value: 'à', icon: 'à', text: 'a - grave' }], 'À should match the "A - grave" and "a - grave"');
    assert.deepEqual(Scan.scan(charMap, '𝅘𝅥𝅮'), [{ value: '𝅘𝅥𝅮', icon: '𝅘𝅥𝅮', text: 'Musical Symbol Eighth Note' }], '𝅘𝅥𝅮 should match "Musical Symbol Eighth Note"');
  });

  it('scan by name', () => {
    assert.deepEqual(Scan.scan(charMap, 'dolla'), [{ value: '$', icon: '$', text: 'dollar sign' }], '"dolla" should match the dollar sign');
    assert.deepEqual(Scan.scan(charMap, 'function'), [{ value: 'ƒ', icon: 'ƒ', text: 'function / florin' }], '"function" should match the function / florin sign');
    assert.deepEqual(Scan.scan(charMap, 'A-'), [{ value: 'À', icon: 'À', text: 'A - grave' }, { value: 'à', icon: 'à', text: 'a - grave' }], '"A-" without spaces should match "A - grave" and "a - grave"');
    assert.deepEqual(Scan.scan(charMap, 'A - '), [{ value: 'À', icon: 'À', text: 'A - grave' }, { value: 'à', icon: 'à', text: 'a - grave' }], '"A - " with spaces should match "A - grave" and "a - grave"');
    assert.deepEqual(Scan.scan(charMap, 'grave'), [{ value: 'À', icon: 'À', text: 'A - grave' }, { value: 'à', icon: 'à', text: 'a - grave' }], '"grave" should match "A - grave" and "a - grave"');
  });
});
