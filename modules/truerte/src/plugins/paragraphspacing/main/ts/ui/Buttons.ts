import Editor from 'truerte/core/api/Editor';
import { Menu, Toolbar } from 'truerte/core/api/ui/Ui';

const menuItems = 'addparagraphspacingbefore addparagraphspacingafter | removeparagraphspacingbefore removeparagraphspacingafter';

const onSetupEditable = (editor: Editor) => (api: Toolbar.ToolbarButtonInstanceApi | Menu.MenuItemInstanceApi): VoidFunction => {
  const nodeChanged = () => {
    api.setEnabled(editor.selection.isEditable());
  };

  editor.on('NodeChange', nodeChanged);
  nodeChanged();

  return () => {
    editor.off('NodeChange', nodeChanged);
  };
};

const register = (editor: Editor): void => {
  editor.ui.registry.addMenuItem('addparagraphspacingbefore', {
    text: 'Add spacing before paragraph',
    icon: 'table-insert-row-above',
    onAction: () => editor.execCommand('mceParagraphSpacingAddBefore'),
    onSetup: onSetupEditable(editor)
  });

  editor.ui.registry.addMenuItem('addparagraphspacingafter', {
    text: 'Add spacing after paragraph',
    icon: 'table-insert-row-after',
    onAction: () => editor.execCommand('mceParagraphSpacingAddAfter'),
    onSetup: onSetupEditable(editor)
  });

  editor.ui.registry.addMenuItem('removeparagraphspacingbefore', {
    text: 'Remove spacing before paragraph',
    icon: 'table-insert-row-above',
    onAction: () => editor.execCommand('mceParagraphSpacingRemoveBefore'),
    onSetup: onSetupEditable(editor)
  });

  editor.ui.registry.addMenuItem('removeparagraphspacingafter', {
    text: 'Remove spacing after paragraph',
    icon: 'table-insert-row-after',
    onAction: () => editor.execCommand('mceParagraphSpacingRemoveAfter'),
    onSetup: onSetupEditable(editor)
  });

  editor.ui.registry.addMenuButton('paragraphspacing', {
    icon: 'vertical-align',
    tooltip: 'Paragraph spacing',
    fetch: (callback) => callback(menuItems),
    onSetup: onSetupEditable(editor)
  });

  editor.ui.registry.addNestedMenuItem('paragraphspacing', {
    text: 'Paragraph spacing',
    icon: 'vertical-align',
    getSubmenuItems: () => menuItems,
    onSetup: onSetupEditable(editor)
  });
};

export {
  register
};
