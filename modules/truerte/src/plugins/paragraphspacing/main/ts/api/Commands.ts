import Editor from 'truerte/core/api/Editor';

import * as Actions from '../core/Actions';

const register = (editor: Editor): void => {
  editor.addCommand('mceParagraphSpacingAddBefore', () => {
    Actions.addSpacingBefore(editor);
  });

  editor.addCommand('mceParagraphSpacingAddAfter', () => {
    Actions.addSpacingAfter(editor);
  });

  editor.addCommand('mceParagraphSpacingRemoveBefore', () => {
    Actions.removeSpacingBefore(editor);
  });

  editor.addCommand('mceParagraphSpacingRemoveAfter', () => {
    Actions.removeSpacingAfter(editor);
  });
};

export {
  register
};
