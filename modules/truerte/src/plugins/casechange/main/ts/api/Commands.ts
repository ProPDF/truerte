import Editor from 'truerte/core/api/Editor';

import * as Actions from '../core/Actions';

const register = (editor: Editor): void => {
  editor.addCommand('mceLowerCase', () => {
    Actions.changeCase(editor, 'lowercase');
  });

  editor.addCommand('mceUpperCase', () => {
    Actions.changeCase(editor, 'uppercase');
  });

  editor.addCommand('mceTitleCase', () => {
    Actions.changeCase(editor, 'titlecase');
  });
};

export {
  register
};
