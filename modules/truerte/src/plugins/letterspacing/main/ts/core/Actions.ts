import Editor from 'truerte/core/api/Editor';

interface LetterSpacingOption {
  readonly text: string;
  readonly value: string;
}

const formatName = 'letterspacing';

const options: LetterSpacingOption[] = [
  { text: 'Normal', value: 'normal' },
  { text: '0px', value: '0' },
  { text: '0.5px', value: '0.5px' },
  { text: '1px', value: '1px' },
  { text: '1.5px', value: '1.5px' },
  { text: '2px', value: '2px' },
  { text: '3px', value: '3px' }
];

const normalizeLetterSpacing = (value: string): string | null => {
  const normalized = value.trim().toLowerCase();

  if (normalized === 'normal') {
    return normalized;
  }

  if (/^\d+(\.\d+)?$/.test(normalized)) {
    return `${normalized}px`;
  }

  if (/^\d+(\.\d+)?(px|em|rem)$/.test(normalized)) {
    return normalized;
  }

  return null;
};

const registerFormat = (editor: Editor): void => {
  editor.formatter.register(formatName, {
    inline: 'span',
    toggle: false,
    styles: { letterSpacing: '%value' },
    remove_similar: true,
    clear_child_styles: true
  });
};

const applyLetterSpacing = (editor: Editor, value: string): void => {
  const normalized = normalizeLetterSpacing(value);

  if (!normalized || !editor.selection.isEditable()) {
    return;
  }

  editor.undoManager.transact(() => {
    editor.formatter.apply(formatName, { value: normalized });
    editor.nodeChanged();
  });
};

export {
  applyLetterSpacing,
  normalizeLetterSpacing,
  options,
  registerFormat
};
