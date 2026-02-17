import { Cell } from '@ephox/katamari';

import Editor from 'truerte/core/api/Editor';
import { Menu, Toolbar } from 'truerte/core/api/ui/Ui';
import Tools from 'truerte/core/api/util/Tools';

import { applyLetterSpacing, normalizeLetterSpacing, options } from '../core/Actions';

const onSetupEditable = (editor: Editor) => (api: Toolbar.ToolbarSplitButtonInstanceApi | Menu.MenuItemInstanceApi): VoidFunction => {
  const onSelectionChange = () => {
    api.setEnabled(editor.selection.isEditable());
  };

  editor.on('NodeChange', onSelectionChange);
  editor.on('SelectionChange', onSelectionChange);
  onSelectionChange();

  return () => {
    editor.off('NodeChange', onSelectionChange);
    editor.off('SelectionChange', onSelectionChange);
  };
};

const register = (editor: Editor): void => {
  const selectedItem = Cell(options[0].value);

  const applySpacing = (value: string): void => {
    const normalized = normalizeLetterSpacing(value);

    if (!normalized) {
      return;
    }

    selectedItem.set(normalized);
    applyLetterSpacing(editor, normalized);
  };

  editor.ui.registry.addSplitButton('letterspacing', {
    text: 'LS',
    tooltip: 'Letter spacing',
    select: (value) => value === selectedItem.get(),
    fetch: (done) => {
      done(Tools.map(options, (option): Menu.ChoiceMenuItemSpec => ({
        type: 'choiceitem',
        text: option.text,
        value: option.value
      })));
    },
    onAction: () => applySpacing(selectedItem.get()),
    onItemAction: (_api, value) => applySpacing(value),
    onSetup: onSetupEditable(editor)
  });

  editor.ui.registry.addNestedMenuItem('letterspacing', {
    text: 'Letter spacing',
    getSubmenuItems: () => Tools.map(options, (option): Menu.MenuItemSpec => ({
      type: 'menuitem',
      text: option.text,
      onAction: () => applySpacing(option.value)
    })),
    onSetup: onSetupEditable(editor)
  });
};

export {
  register
};
