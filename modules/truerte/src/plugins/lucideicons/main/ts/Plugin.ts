import PluginManager from 'truerte/core/api/PluginManager';

import * as Icons from './core/Icons';

export default (): void => {
  PluginManager.add('lucideicons', (editor) => {
    Icons.register(editor);
  });
};
