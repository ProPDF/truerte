import Editor from 'truerte/core/api/Editor';

const svg = (body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style="fill: none;" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const lucideIcons: Record<string, string> = {
  'align-left': svg('<line x1="15" x2="3" y1="6" y2="6"/><line x1="17" x2="3" y1="12" y2="12"/><line x1="13" x2="3" y1="18" y2="18"/>'),
  'align-center': svg('<line x1="18" x2="6" y1="6" y2="6"/><line x1="21" x2="3" y1="12" y2="12"/><line x1="18" x2="6" y1="18" y2="18"/>'),
  'align-right': svg('<line x1="21" x2="9" y1="6" y2="6"/><line x1="21" x2="7" y1="12" y2="12"/><line x1="21" x2="11" y1="18" y2="18"/>'),
  'align-justify': svg('<line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/>'),
  'bold': svg('<path d="M14 12a4 4 0 0 0 0-8H6v8"/><path d="M15 20a4 4 0 0 0 0-8H6v8Z"/>'),
  'italic': svg('<line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>'),
  'underline': svg('<path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/>'),
  'strike-through': svg('<path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/>'),
  'undo': svg('<path d="m9 14-5-5 5-5"/><path d="M20 20a8 8 0 0 0-8-8H4"/>'),
  'redo': svg('<path d="m15 14 5-5-5-5"/><path d="M4 20a8 8 0 0 1 8-8h8"/>'),
  'link': svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L11 5"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 1 0 7.07 7.07L13 19"/>'),
  'unlink': svg('<path d="m18.84 12.25 1.72-1.71a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="m5.16 11.75-1.72 1.71a5 5 0 1 0 7.07 7.07l1.72-1.71"/><line x1="8" x2="16" y1="2" y2="22"/>'),
  'ordered-list': svg('<line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3a1 1 0 0 0-2 0"/>'),
  'unordered-list': svg('<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>'),
  'sourcecode': svg('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
  'search': svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),
  'fullscreen': svg('<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>'),
  'save': svg('<path d="M15.2 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.8L15.2 3Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>'),
  'table': svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M12 3v18"/>'),
  'table-insert-row-above': svg('<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 14h18"/><path d="M12 2v4"/><path d="m9 5 3-3 3 3"/>'),
  'table-insert-row-after': svg('<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M3 9h18"/><path d="M12 22v-4"/><path d="m9 19 3 3 3-3"/>'),
  'table-insert-column-before': svg('<rect x="8" y="3" width="13" height="18" rx="2"/><path d="M14 3v18"/><path d="M2 12h4"/><path d="m5 9-3 3 3 3"/>'),
  'table-insert-column-after': svg('<rect x="3" y="3" width="13" height="18" rx="2"/><path d="M9 3v18"/><path d="M22 12h-4"/><path d="m19 9 3 3-3 3"/>'),
  'vertical-align': svg('<rect x="6" y="4" width="12" height="4" rx="1"/><rect x="4" y="16" width="16" height="4" rx="1"/><path d="M12 8v8"/><path d="m9 11 3-3 3 3"/><path d="m9 13 3 3 3-3"/>'),
  'change-case': svg('<path d="M4 20h4"/><path d="m6 16 4-10 4 10"/><path d="M8 12h4"/><path d="M15 9h5"/><path d="M17.5 9v8"/><path d="M20 17h-5"/>')
};

const register = (editor: Editor): void => {
  Object.keys(lucideIcons).forEach((name) => {
    editor.ui.registry.addIcon(name, lucideIcons[name]);
  });
};

export {
  register
};
