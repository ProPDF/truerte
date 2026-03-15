/**
 * TrueRTE version 1.0.10 (TBD)
 * Copyright (c) 2022 Ephox Corporation DBA Tiny Technologies, Inc.
 * Copyright (c) 2024 TrueRTE contributors
 * Licensed under the MIT license (https://github.com/truerte/truerte/blob/main/LICENSE.TXT)
 */

(function () {
    'use strict';

    var global$1 = truerte.util.Tools.resolve('truerte.PluginManager');

    const isTextNode = node => !!node && node.nodeType === 3;
    const isWordCharacter = char => /\w/.test(char) || char.toLowerCase() !== char.toUpperCase();
    const isTitleBoundary = char => /\s/.test(char) || /[\-_/\\()[\]{}:;,.!?@#$%^&*+=|<>~"`]/.test(char);
    const toTitleCase = text => {
      let capitalize = true;
      const chars = Array.from(text.toLowerCase());
      return chars.map(char => {
        if (!isWordCharacter(char)) {
          capitalize = isTitleBoundary(char);
          return char;
        }
        if (capitalize && char.toLowerCase() !== char.toUpperCase()) {
          capitalize = false;
          return char.toUpperCase();
        }
        capitalize = false;
        return char;
      }).join('');
    };
    const transform = (text, mode) => {
      switch (mode) {
      case 'uppercase':
        return text.toUpperCase();
      case 'lowercase':
        return text.toLowerCase();
      case 'titlecase':
        return toTitleCase(text);
      }
    };
    const collectTextSegments = range => {
      if (range.collapsed) {
        return [];
      }
      const commonAncestor = range.commonAncestorContainer;
      if (isTextNode(commonAncestor)) {
        const start = commonAncestor === range.startContainer ? range.startOffset : 0;
        const end = commonAncestor === range.endContainer ? range.endOffset : commonAncestor.data.length;
        return start < end ? [{
            node: commonAncestor,
            start,
            end
          }] : [];
      }
      const doc = commonAncestor.ownerDocument;
      if (!doc) {
        return [];
      }
      const walker = doc.createTreeWalker(commonAncestor, NodeFilter.SHOW_TEXT, { acceptNode: node => isTextNode(node) && node.data.length > 0 && range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
      const segments = [];
      let current = walker.nextNode();
      while (current !== null) {
        if (isTextNode(current)) {
          const start = current === range.startContainer ? range.startOffset : 0;
          const end = current === range.endContainer ? range.endOffset : current.data.length;
          if (start < end) {
            segments.push({
              node: current,
              start,
              end
            });
          }
        }
        current = walker.nextNode();
      }
      return segments;
    };
    const changeCase = (editor, mode) => {
      if (!editor.selection.isEditable() || editor.selection.isCollapsed()) {
        return;
      }
      const bookmark = editor.selection.getBookmark(2, true);
      editor.undoManager.transact(() => {
        const range = editor.selection.getRng();
        const segments = collectTextSegments(range);
        for (const segment of segments) {
          const before = segment.node.data.slice(segment.start, segment.end);
          const after = transform(before, mode);
          if (before !== after) {
            segment.node.data = `${ segment.node.data.slice(0, segment.start) }${ after }${ segment.node.data.slice(segment.end) }`;
          }
        }
        editor.selection.moveToBookmark(bookmark);
        editor.nodeChanged();
      });
    };

    const caseModes = [
      'lowercase',
      'uppercase',
      'titlecase'
    ];
    const isCaseChangeMode$1 = value => typeof value === 'string' && caseModes.indexOf(value) !== -1;
    const register$1 = editor => {
      editor.addCommand('mceLowerCase', () => {
        changeCase(editor, 'lowercase');
      });
      editor.addCommand('mceUpperCase', () => {
        changeCase(editor, 'uppercase');
      });
      editor.addCommand('mceTitleCase', () => {
        changeCase(editor, 'titlecase');
      });
      editor.addCommand('mceSetTextCase', (_ui, value) => {
        if (isCaseChangeMode$1(value)) {
          changeCase(editor, value);
        }
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

    const items = [
      {
        text: 'Lowercase',
        value: 'lowercase'
      },
      {
        text: 'UPPERCASE',
        value: 'uppercase'
      },
      {
        text: 'Title Case',
        value: 'titlecase'
      }
    ];
    const isCaseChangeMode = value => value === 'lowercase' || value === 'uppercase' || value === 'titlecase';
    const onSetupEditable = editor => api => {
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
    const register = editor => {
      const selectedItem = Cell('lowercase');
      const applyCase = mode => {
        selectedItem.set(mode);
        changeCase(editor, mode);
      };
      editor.ui.registry.addSplitButton('casechange', {
        text: 'Aa',
        tooltip: 'Change case',
        select: value => value === selectedItem.get(),
        fetch: callback => {
          callback(global.map(items, item => ({
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
        getSubmenuItems: () => global.map(items, item => ({
          type: 'menuitem',
          text: item.text,
          onAction: () => applyCase(item.value)
        })),
        onSetup: onSetupEditable(editor)
      });
    };

    var Plugin = () => {
      global$1.add('casechange', editor => {
        register$1(editor);
        register(editor);
      });
    };

    Plugin();

})();
