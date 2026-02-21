import Editor from 'truerte/core/api/Editor';

import * as Actions from '../core/Actions';

const apply = (editor: Editor, value: unknown): void => {
  if (typeof value === 'string') {
    Actions.applyLetterSpacing(editor, value);
  } else if (typeof value === 'number') {
    Actions.applyLetterSpacing(editor, String(value));
  }
};

const register = (editor: Editor): void => {
  editor.addCommand('mceLetterSpacing', (_ui, value) => {
    apply(editor, value);
  });

  // Alias used by imperative wrapper methods.
  editor.addCommand('mceSetLetterSpacing', (_ui, value) => {
    apply(editor, value);
  });
};

export {
  register
};
