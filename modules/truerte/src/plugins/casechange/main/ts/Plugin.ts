import PluginManager from 'truerte/core/api/PluginManager';

import * as Commands from './api/Commands';
import * as Buttons from './ui/Buttons';

export default (): void => {
  PluginManager.add('casechange', (editor) => {
    Commands.register(editor);
    Buttons.register(editor);
  });
};
