import Editor from 'truerte/core/api/Editor';

import * as Actions from '../core/Actions';
import type { CaseChangeMode } from '../core/Actions';

const caseModes: CaseChangeMode[] = [ 'lowercase', 'uppercase', 'titlecase' ];

const isCaseChangeMode = (value: unknown): value is CaseChangeMode =>
  typeof value === 'string' && caseModes.indexOf(value as CaseChangeMode) !== -1;

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

  // Unified command that can be used by imperative APIs and wrappers.
  editor.addCommand('mceSetTextCase', (_ui, value) => {
    if (isCaseChangeMode(value)) {
      Actions.changeCase(editor, value);
    }
  });
};

export {
  register
};
