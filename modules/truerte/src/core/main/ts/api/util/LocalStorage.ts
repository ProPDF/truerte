import * as FakeStorage from './FakeStorage';

/**
 * @class truerte.util.LocalStorage
 * @static
 * @version 4.0
 * @private
 * @example
 * truerte.util.LocalStorage.setItem('key', 'value');
 * const value = truerte.util.LocalStorage.getItem('key');
 */

let localStorage: Storage;

// Browsers with certain strict security settings will explode when trying to access localStorage
// so we need to do a try/catch and a simple stub here. #TINY-1782 & #TINY-5935

try {
  const test = '__storage_test__';
  localStorage = window.localStorage;
  // Make sure we can set a value, as storage may also be full
  localStorage.setItem(test, test);
  localStorage.removeItem(test);
} catch (e) {
  localStorage = FakeStorage.create();
}

export default localStorage;
