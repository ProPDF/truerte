import PluginManager from 'truerte/core/api/PluginManager';

import * as Commands from './api/Commands';
import * as Buttons from './ui/Buttons';
import * as Actions from './core/Actions';

export default (): void => {
  PluginManager.add('letterspacing', (editor) => {
    Commands.register(editor);
    Buttons.register(editor);

    editor.on('PreInit', () => {
      Actions.registerFormat(editor);
    });
  });
};
