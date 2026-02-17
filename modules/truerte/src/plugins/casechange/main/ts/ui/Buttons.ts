import { Cell } from '@ephox/katamari';

import Editor from 'truerte/core/api/Editor';
import { Menu, Toolbar } from 'truerte/core/api/ui/Ui';
import Tools from 'truerte/core/api/util/Tools';

import { CaseChangeMode, changeCase } from '../core/Actions';

interface CaseChangeMenuItem {
  readonly text: string;
  readonly value: CaseChangeMode;
}

const items: CaseChangeMenuItem[] = [
  { text: 'Lowercase', value: 'lowercase' },
  { text: 'UPPERCASE', value: 'uppercase' },
  { text: 'Title Case', value: 'titlecase' }
];

const isCaseChangeMode = (value: string): value is CaseChangeMode =>
  value === 'lowercase' || value === 'uppercase' || value === 'titlecase';

const onSetupEditable = (editor: Editor) => (api: Toolbar.ToolbarSplitButtonInstanceApi | Menu.MenuItemInstanceApi): VoidFunction => {
  const onSelectionChange = () => {
    api.setEnabled(editor.selection.isEditable() && !editor.selection.isCollapsed());
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
  const selectedItem = Cell<CaseChangeMode>('lowercase');

  const applyCase = (mode: CaseChangeMode): void => {
    selectedItem.set(mode);
    changeCase(editor, mode);
  };

  editor.ui.registry.addSplitButton('casechange', {
    text: 'Aa',
    tooltip: 'Change case',
    select: (value) => value === selectedItem.get(),
    fetch: (callback) => {
      callback(Tools.map(items, (item): Menu.ChoiceMenuItemSpec => ({
        type: 'choiceitem',
        text: item.text,
        value: item.value
      })));
    },
    onAction: () => applyCase(selectedItem.get()),
    onItemAction: (_api, value) => {
      if (isCaseChangeMode(value)) {
        applyCase(value);
      }
    },
    onSetup: onSetupEditable(editor)
  });

  editor.ui.registry.addNestedMenuItem('casechange', {
    text: 'Change case',
    getSubmenuItems: () => Tools.map(items, (item): Menu.MenuItemSpec => ({
      type: 'menuitem',
      text: item.text,
      onAction: () => applyCase(item.value)
    })),
    onSetup: onSetupEditable(editor)
  });
};

export {
  register
};
