import { truerte, TrueRTE } from './Truerte';

declare const module: any;
declare const window: any;

const exportToModuleLoaders = (truerte: TrueRTE) => {
  if (typeof module === 'object') {
    try {
      module.exports = truerte;
    } catch (_) {
      // It will thrown an error when running this module
      // within webpack where the module.exports object is sealed
    }
  }
};

const exportToWindowGlobal = (truerte: TrueRTE) => {
  window.truerte = truerte;
  window.trueRTE = truerte;
};

exportToWindowGlobal(truerte);
exportToModuleLoaders(truerte);
