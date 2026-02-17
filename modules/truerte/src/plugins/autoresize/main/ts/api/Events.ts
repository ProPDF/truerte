import Editor from 'truerte/core/api/Editor';
import { EditorEvent } from 'truerte/core/api/util/EventDispatcher';

const fireResizeEditor = (editor: Editor): EditorEvent<{}> =>
  editor.dispatch('ResizeEditor');

export {
  fireResizeEditor
};
