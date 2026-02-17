import { Arr, Type } from '@ephox/katamari';

import Editor from 'truerte/core/api/Editor';

import * as Options from '../api/Options';

type Position = 'before' | 'after';

const getStyleName = (position: Position): string =>
  position === 'before' ? 'margin-top' : 'margin-bottom';

const parsePixels = (value: string | undefined): number => {
  if (!value) {
    return 0;
  }

  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getTargetBlocks = (editor: Editor): HTMLElement[] => {
  const selectedBlocks = editor.selection.getSelectedBlocks();
  const blocks = selectedBlocks.length > 0
    ? selectedBlocks
    : [ editor.dom.getParent(editor.selection.getStart(true), editor.dom.isBlock) ];

  return Arr.filter(blocks, (block): block is HTMLElement =>
    Type.isNonNullable(block) && block !== editor.getBody() && editor.dom.isEditable(block)
  );
};

const setSpacingPx = (editor: Editor, position: Position, getNext: (current: number) => number): void => {
  if (!editor.selection.isEditable()) {
    return;
  }

  const styleName = getStyleName(position);

  editor.undoManager.transact(() => {
    Arr.each(getTargetBlocks(editor), (block) => {
      const current = parsePixels(editor.dom.getStyle(block, styleName, true));
      const next = Math.max(0, getNext(current));
      editor.dom.setStyle(block, styleName, `${next}px`);
    });

    editor.nodeChanged();
  });
};

const adjustSpacing = (editor: Editor, position: Position, amount: number): void => {
  const step = Options.getSpacingStep(editor);
  const delta = amount * step;
  setSpacingPx(editor, position, (current) => current + delta);
};

const addSpacingBefore = (editor: Editor): void => {
  adjustSpacing(editor, 'before', 1);
};

const addSpacingAfter = (editor: Editor): void => {
  adjustSpacing(editor, 'after', 1);
};

const removeSpacingBefore = (editor: Editor): void => {
  setSpacingPx(editor, 'before', () => 0);
};

const removeSpacingAfter = (editor: Editor): void => {
  setSpacingPx(editor, 'after', () => 0);
};

export {
  addSpacingBefore,
  addSpacingAfter,
  removeSpacingBefore,
  removeSpacingAfter
};
