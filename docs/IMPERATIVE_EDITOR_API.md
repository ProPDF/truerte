# TrueRTE Imperative Editor API

This guide documents the imperative methods available on a `truerte.Editor` instance for external feature control.

These methods are designed for programmatic control (framework wrappers, command palettes, custom toolbars, keyboard automation, etc).

## Getting an editor instance

```js
const editor = truerte.get('my-editor-id');
```

or inside `setup`:

```js
truerte.init({
  selector: '#my-editor',
  setup: (editor) => {
    // use editor instance directly
  }
});
```

## Feature methods

## Content and history

- `editor.getContent()`
- `editor.setContent(html)`
- `editor.insertContent(html)`
- `editor.undo()`
- `editor.redo()`

## Text formatting

- `editor.toggleBold()`
- `editor.toggleItalic()`
- `editor.toggleUnderline()`
- `editor.toggleStrikethrough()`
- `editor.toggleSubscript()`
- `editor.toggleSuperscript()`

## Block, font, spacing, colors

- `editor.setBlock('p' | 'h1' | 'h2' | ...)`
- `editor.setFontFamily('Arial')`
- `editor.setFontSize('14pt')`
- `editor.setLineHeight('1.5')`
- `editor.setTextColor('#ff0000')`
- `editor.setBackgroundColor('#ffff00')`

## Alignment

- `editor.alignLeft()`
- `editor.alignCenter()`
- `editor.alignRight()`
- `editor.alignJustify()`

## Lists and indentation

- `editor.toggleBulletList(styleType?)`
- `editor.toggleNumberedList(styleType?)`
- `editor.outdent()`
- `editor.indent()`

## Link features

- `editor.openLinkDialog()`
- `editor.insertLink('https://example.com')`
- `editor.insertLink({ href: 'https://example.com', target: '_blank' })`
- `editor.removeLink()`

## Table and code features

- `editor.insertTable(rows, columns)`
- `editor.openCodeEditor()`

## Case change and letter spacing (plugin-driven)

Requires plugins:
- `casechange`
- `letterspacing`
- `paragraphspacing`

Methods:
- `editor.setTextCase('uppercase' | 'lowercase' | 'titlecase')`
- `editor.setLetterSpacing('1.5px' | 2 | 'normal')`
- `editor.setParagraphSpacing('before' | 'after', 'add' | 'remove')`
- `editor.addParagraphSpacingBefore()`
- `editor.addParagraphSpacingAfter()`
- `editor.removeParagraphSpacingBefore()`
- `editor.removeParagraphSpacingAfter()`

## Under-the-hood command mapping

The imperative methods map to commands:

- `setTextCase` -> `mceSetTextCase`
- `setLetterSpacing` -> `mceSetLetterSpacing`
- `setParagraphSpacing` -> `mceSetParagraphSpacing`

You can still run any command directly:

```js
editor.execCommand('mceTableInsertRowAfter');
editor.execCommand('mceTableDeleteCol');
editor.execCommand('mceVisualBlocks');
```

Use direct commands when you need features not covered by convenience methods.

