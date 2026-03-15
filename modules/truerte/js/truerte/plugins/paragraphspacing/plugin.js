/**
 * TrueRTE version 1.0.10 (TBD)
 * Copyright (c) 2022 Ephox Corporation DBA Tiny Technologies, Inc.
 * Copyright (c) 2024 TrueRTE contributors
 * Licensed under the MIT license (https://github.com/truerte/truerte/blob/main/LICENSE.TXT)
 */

(function () {
    'use strict';

    var global = truerte.util.Tools.resolve('truerte.PluginManager');

    const isNullable = a => a === null || a === undefined;
    const isNonNullable = a => !isNullable(a);

    const each = (xs, f) => {
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        f(x, i);
      }
    };
    const filter = (xs, pred) => {
      const r = [];
      for (let i = 0, len = xs.length; i < len; i++) {
        const x = xs[i];
        if (pred(x, i)) {
          r.push(x);
        }
      }
      return r;
    };

    const option = name => editor => editor.options.get(name);
    const register$2 = editor => {
      const registerOption = editor.options.register;
      registerOption('paragraphspacing_step', {
        processor: 'number',
        default: 12
      });
    };
    const getSpacingStep = option('paragraphspacing_step');

    const getStyleName = position => position === 'before' ? 'margin-top' : 'margin-bottom';
    const parsePixels = value => {
      if (!value) {
        return 0;
      }
      const parsed = parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const getTargetBlocks = editor => {
      const selectedBlocks = editor.selection.getSelectedBlocks();
      const blocks = selectedBlocks.length > 0 ? selectedBlocks : [editor.dom.getParent(editor.selection.getStart(true), editor.dom.isBlock)];
      return filter(blocks, block => isNonNullable(block) && block !== editor.getBody() && editor.dom.isEditable(block));
    };
    const setSpacingPx = (editor, position, getNext) => {
      if (!editor.selection.isEditable()) {
        return;
      }
      const styleName = getStyleName(position);
      editor.undoManager.transact(() => {
        each(getTargetBlocks(editor), block => {
          const current = parsePixels(editor.dom.getStyle(block, styleName, true));
          const next = Math.max(0, getNext(current));
          editor.dom.setStyle(block, styleName, `${ next }px`);
        });
        editor.nodeChanged();
      });
    };
    const adjustSpacing = (editor, position, amount) => {
      const step = getSpacingStep(editor);
      const delta = amount * step;
      setSpacingPx(editor, position, current => current + delta);
    };
    const addSpacingBefore = editor => {
      adjustSpacing(editor, 'before', 1);
    };
    const addSpacingAfter = editor => {
      adjustSpacing(editor, 'after', 1);
    };
    const removeSpacingBefore = editor => {
      setSpacingPx(editor, 'before', () => 0);
    };
    const removeSpacingAfter = editor => {
      setSpacingPx(editor, 'after', () => 0);
    };

    const isPosition = value => value === 'before' || value === 'after';
    const isAction = value => value === 'add' || value === 'remove';
    const run = (editor, position, action) => {
      if (position === 'before' && action === 'add') {
        addSpacingBefore(editor);
      } else if (position === 'before' && action === 'remove') {
        removeSpacingBefore(editor);
      } else if (position === 'after' && action === 'add') {
        addSpacingAfter(editor);
      } else {
        removeSpacingAfter(editor);
      }
    };
    const register$1 = editor => {
      editor.addCommand('mceParagraphSpacingAddBefore', () => {
        addSpacingBefore(editor);
      });
      editor.addCommand('mceParagraphSpacingAddAfter', () => {
        addSpacingAfter(editor);
      });
      editor.addCommand('mceParagraphSpacingRemoveBefore', () => {
        removeSpacingBefore(editor);
      });
      editor.addCommand('mceParagraphSpacingRemoveAfter', () => {
        removeSpacingAfter(editor);
      });
      editor.addCommand('mceSetParagraphSpacing', (_ui, value) => {
        if (value && isPosition(value.position) && isAction(value.action)) {
          run(editor, value.position, value.action);
        }
      });
    };

    const menuItems = 'addparagraphspacingbefore addparagraphspacingafter | removeparagraphspacingbefore removeparagraphspacingafter';
    const onSetupEditable = editor => api => {
      const nodeChanged = () => {
        api.setEnabled(editor.selection.isEditable());
      };
      editor.on('NodeChange', nodeChanged);
      nodeChanged();
      return () => {
        editor.off('NodeChange', nodeChanged);
      };
    };
    const register = editor => {
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
        fetch: callback => callback(menuItems),
        onSetup: onSetupEditable(editor)
      });
      editor.ui.registry.addNestedMenuItem('paragraphspacing', {
        text: 'Paragraph spacing',
        icon: 'vertical-align',
        getSubmenuItems: () => menuItems,
        onSetup: onSetupEditable(editor)
      });
    };

    var Plugin = () => {
      global.add('paragraphspacing', editor => {
        register$2(editor);
        register$1(editor);
        register(editor);
      });
    };

    Plugin();

})();
