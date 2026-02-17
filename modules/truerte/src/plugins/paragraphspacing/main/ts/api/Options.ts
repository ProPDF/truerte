import Editor from 'truerte/core/api/Editor';
import { EditorOptions } from 'truerte/core/api/OptionTypes';

const option: {
  <K extends keyof EditorOptions>(name: K): (editor: Editor) => EditorOptions[K];
  <T>(name: string): (editor: Editor) => T;
} = (name: string) => (editor: Editor) =>
  editor.options.get(name);

const register = (editor: Editor): void => {
  const registerOption = editor.options.register;

  registerOption('paragraphspacing_step', {
    processor: 'number',
    default: 12
  });
};

const getSpacingStep = option<number>('paragraphspacing_step');

export {
  register,
  getSpacingStep
};
