import Editor from 'truerte/core/api/Editor';

import * as Actions from '../core/Actions';

const register = (editor: Editor): void => {
  editor.addCommand('mceLetterSpacing', (_ui, value) => {
    if (typeof value === 'string') {
      Actions.applyLetterSpacing(editor, value);
    } else if (typeof value === 'number') {
      Actions.applyLetterSpacing(editor, String(value));
    }
  });
};

export {
  register
};
