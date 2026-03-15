/**
 * TrueRTE version 1.0.10 (TBD)
 * Copyright (c) 2022 Ephox Corporation DBA Tiny Technologies, Inc.
 * Copyright (c) 2024 TrueRTE contributors
 * Licensed under the MIT license (https://github.com/truerte/truerte/blob/main/LICENSE.TXT)
 */

(function () {
    'use strict';

    var global$1 = truerte.util.Tools.resolve('truerte.PluginManager');

    const formatName = 'letterspacing';
    const options = [
      {
        text: 'Normal',
        value: 'normal'
      },
      {
        text: '0px',
        value: '0'
      },
      {
        text: '0.5px',
        value: '0.5px'
      },
      {
        text: '1px',
        value: '1px'
      },
      {
        text: '1.5px',
        value: '1.5px'
      },
      {
        text: '2px',
        value: '2px'
      },
      {
        text: '3px',
        value: '3px'
      }
    ];
    const normalizeLetterSpacing = value => {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'normal') {
        return normalized;
      }
      if (/^\d+(\.\d+)?$/.test(normalized)) {
        return `${ normalized }px`;
      }
      if (/^\d+(\.\d+)?(px|em|rem)$/.test(normalized)) {
        return normalized;
      }
      return null;
    };
    const registerFormat = editor => {
      editor.formatter.register(formatName, {
        inline: 'span',
        toggle: false,
        styles: { letterSpacing: '%value' },
        remove_similar: true,
        clear_child_styles: true
      });
    };
    const applyLetterSpacing = (editor, value) => {
      const normalized = normalizeLetterSpacing(value);
      if (!normalized || !editor.selection.isEditable()) {
        return;
      }
      editor.undoManager.transact(() => {
        editor.formatter.apply(formatName, { value: normalized });
        editor.nodeChanged();
      });
    };

    const apply = (editor, value) => {
      if (typeof value === 'string') {
        applyLetterSpacing(editor, value);
      } else if (typeof value === 'number') {
        applyLetterSpacing(editor, String(value));
      }
    };
    const register$1 = editor => {
      editor.addCommand('mceLetterSpacing', (_ui, value) => {
        apply(editor, value);
      });
      editor.addCommand('mceSetLetterSpacing', (_ui, value) => {
        apply(editor, value);
      });
    };

    const Cell = initial => {
      let value = initial;
      const get = () => {
        return value;
      };
      const set = v => {
        value = v;
      };
      return {
        get,
        set
      };
    };

    var global = truerte.util.Tools.resolve('truerte.util.Tools');

    const onSetupEditable = editor => api => {
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
    const register = editor => {
      const selectedItem = Cell(options[0].value);
      const applySpacing = value => {
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
        select: value => value === selectedItem.get(),
        fetch: done => {
          done(global.map(options, option => ({
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
        getSubmenuItems: () => global.map(options, option => ({
          type: 'menuitem',
          text: option.text,
          onAction: () => applySpacing(option.value)
        })),
        onSetup: onSetupEditable(editor)
      });
    };

    var Plugin = () => {
      global$1.add('letterspacing', editor => {
        register$1(editor);
        register(editor);
        editor.on('PreInit', () => {
          registerFormat(editor);
        });
      });
    };

    Plugin();

})();
