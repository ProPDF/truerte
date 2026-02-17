import Editor from 'truerte/core/api/Editor';
import { EditorEvent } from 'truerte/core/api/util/EventDispatcher';

const fireInsertCustomChar = (editor: Editor, chr: string): EditorEvent<{ chr: string }> => {
  return editor.dispatch('insertCustomChar', { chr });
};

export {
  fireInsertCustomChar
};
