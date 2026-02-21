import Editor from 'truerte/core/api/Editor';

import * as Actions from '../core/Actions';

type ParagraphSpacingPosition = 'before' | 'after';
type ParagraphSpacingAction = 'add' | 'remove';

interface SetParagraphSpacingCommand {
  readonly position: ParagraphSpacingPosition;
  readonly action: ParagraphSpacingAction;
}

const isPosition = (value: unknown): value is ParagraphSpacingPosition =>
  value === 'before' || value === 'after';

const isAction = (value: unknown): value is ParagraphSpacingAction =>
  value === 'add' || value === 'remove';

const run = (editor: Editor, position: ParagraphSpacingPosition, action: ParagraphSpacingAction): void => {
  if (position === 'before' && action === 'add') {
    Actions.addSpacingBefore(editor);
  } else if (position === 'before' && action === 'remove') {
    Actions.removeSpacingBefore(editor);
  } else if (position === 'after' && action === 'add') {
    Actions.addSpacingAfter(editor);
  } else {
    Actions.removeSpacingAfter(editor);
  }
};

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

  // Unified command for imperative external control.
  editor.addCommand('mceSetParagraphSpacing', (_ui, value: SetParagraphSpacingCommand | undefined) => {
    if (value && isPosition(value.position) && isAction(value.action)) {
      run(editor, value.position, value.action);
    }
  });
};

export {
  register
};
