import Editor from 'truerte/core/api/Editor';

type CaseChangeMode = 'lowercase' | 'uppercase' | 'titlecase';

interface TextSegment {
  readonly node: Text;
  readonly start: number;
  readonly end: number;
}

const isTextNode = (node: Node | null | undefined): node is Text =>
  !!node && node.nodeType === 3;

const isWordCharacter = (char: string): boolean =>
  /\w/.test(char) || char.toLowerCase() !== char.toUpperCase();

const isTitleBoundary = (char: string): boolean =>
  /\s/.test(char) || /[\-_/\\()[\]{}:;,.!?@#$%^&*+=|<>~"`]/.test(char);

const toTitleCase = (text: string): string => {
  let capitalize = true;
  const chars = Array.from(text.toLowerCase());

  return chars.map((char) => {
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

const transform = (text: string, mode: CaseChangeMode): string => {
  switch (mode) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'titlecase':
      return toTitleCase(text);
  }
};

const collectTextSegments = (range: Range): TextSegment[] => {
  if (range.collapsed) {
    return [];
  }

  const commonAncestor = range.commonAncestorContainer;
  if (isTextNode(commonAncestor)) {
    const start = commonAncestor === range.startContainer ? range.startOffset : 0;
    const end = commonAncestor === range.endContainer ? range.endOffset : commonAncestor.data.length;

    return start < end ? [ { node: commonAncestor, start, end } ] : [];
  }

  const doc = commonAncestor.ownerDocument;
  if (!doc) {
    return [];
  }

  const walker = doc.createTreeWalker(commonAncestor, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => isTextNode(node) && node.data.length > 0 && range.intersectsNode(node) ?
      NodeFilter.FILTER_ACCEPT :
      NodeFilter.FILTER_REJECT
  });

  const segments: TextSegment[] = [];

  let current = walker.nextNode();
  while (current !== null) {
    if (isTextNode(current)) {
      const start = current === range.startContainer ? range.startOffset : 0;
      const end = current === range.endContainer ? range.endOffset : current.data.length;

      if (start < end) {
        segments.push({ node: current, start, end });
      }
    }

    current = walker.nextNode();
  }

  return segments;
};

const changeCase = (editor: Editor, mode: CaseChangeMode): void => {
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
        segment.node.data = `${segment.node.data.slice(0, segment.start)}${after}${segment.node.data.slice(segment.end)}`;
      }
    }

    editor.selection.moveToBookmark(bookmark);
    editor.nodeChanged();
  });
};

export {
  changeCase
};

export type {
  CaseChangeMode
};
