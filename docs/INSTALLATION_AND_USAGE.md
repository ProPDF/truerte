# TrueRTE Installation and Usage Guide

This guide covers complete setup and usage for core `truerte` (the browser editor), including CDN usage, self-hosted assets, initialization, plugin setup, framework integration patterns, and local source builds.

## 1. What `truerte` Is

`truerte` is a browser rich text editor (an MIT-focused fork of TinyMCE 6) distributed as JavaScript + static assets.

Runtime behavior:

- The editor is loaded in the browser (global `window.truerte`).
- It lazy-loads themes, icons, plugins, language packs, and CSS from its base URL.
- Correct script/asset hosting is required for reliable initialization.

## 2. Installation Options

## 2.1 Package install (recommended for apps)

```bash
npm install truerte
```

or

```bash
yarn add truerte
```

## 2.2 CDN script (quick prototypes)

Use jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/truerte@1/truerte.min.js"></script>
```

For production, pin an exact version:

```html
<script src="https://cdn.jsdelivr.net/npm/truerte@1.0.9/truerte.min.js"></script>
```

## 3. File Layout and Required Assets

When installed from npm, the package contains:

```text
node_modules/truerte/js/truerte/
  truerte.min.js
  truerte.js
  plugins/
  skins/
  themes/
  icons/
  langs/
  models/
```

If self-hosting, copy that folder to your app static directory (for example `public/truerte`).

## 4. Self-Hosted Setup (Recommended)

## 4.1 Copy assets to your static folder

Example copy command:

```bash
mkdir -p public/truerte
cp -R node_modules/truerte/js/truerte/* public/truerte/
```

## 4.2 Load script in HTML

```html
<script src="/truerte/truerte.min.js"></script>
```

## 4.3 Initialize editor

```html
<textarea id="editor">Hello TrueRTE</textarea>

<script>
  truerte.init({
    selector: "#editor",
    base_url: "/truerte",
    plugins: "lists link table code",
    toolbar: "undo redo | bold italic underline | bullist numlist | link table | code",
    menubar: "file edit view insert format tools table help"
  });
</script>
```

Why `base_url` is important:

- It controls where lazy-loaded assets are fetched.
- If omitted, TrueRTE tries to infer from the script URL.
- Explicit `base_url` avoids path bugs behind proxies, CDNs, subpaths, or framework routers.

## 5. Quick Start (CDN)

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>TrueRTE CDN Quick Start</title>
  </head>
  <body>
    <textarea id="editor"></textarea>

    <script src="https://cdn.jsdelivr.net/npm/truerte@1.0.9/truerte.min.js"></script>
    <script>
      truerte.init({
        selector: "#editor",
        plugins: "lists link table code",
        toolbar: "undo redo | bold italic underline | bullist numlist | link table | code"
      });
    </script>
  </body>
</html>
```

## 6. Core Usage Patterns

## 6.1 Iframe mode (default)

Use a `<textarea>` target:

```js
truerte.init({
  selector: "textarea.rich-text"
});
```

## 6.2 Inline mode

Use a content element (for example `<div>`):

```js
truerte.init({
  selector: "div.rich-text",
  inline: true,
  toolbar: "bold italic underline"
});
```

## 6.3 Programmatic target instead of selector

```js
const el = document.getElementById("editor");
truerte.init({
  target: el
});
```

## 7. Plugins, Toolbar, and External Plugins

## 7.1 Built-in plugins

```js
truerte.init({
  selector: "#editor",
  base_url: "/truerte",
  plugins: "lists link table code fullscreen wordcount",
  toolbar: "undo redo | bold italic | bullist numlist | link table | fullscreen code"
});
```

## 7.2 External plugins (custom/local)

```js
truerte.init({
  selector: "#editor",
  base_url: "/truerte",
  plugins: "casechange letterspacing paragraphspacing lists link code table",
  external_plugins: {
    casechange: "/truerte/plugins/casechange/plugin.min.js",
    letterspacing: "/truerte/plugins/letterspacing/plugin.min.js",
    paragraphspacing: "/truerte/plugins/paragraphspacing/plugin.min.js"
  },
  toolbar: "casechange letterspacing paragraphspacing | bold italic | link table code"
});
```

## 7.3 Lucide icon pack

```js
truerte.init({
  selector: "#editor",
  base_url: "/truerte",
  icons: "truerte-lucide"
});
```

## 8. Content, Events, and API Basics

## 8.1 Getting editor instances

```js
const editor = truerte.get("editor-id");
const allEditors = truerte.get();
```

## 8.2 Working with content

```js
editor.setContent("<p>Updated content</p>");
const html = editor.getContent();
editor.insertContent("<strong>Inline insert</strong>");
```

## 8.3 Events

```js
truerte.init({
  selector: "#editor",
  setup: (editor) => {
    editor.on("init", () => console.log("initialized"));
    editor.on("change", () => console.log("changed"));
    editor.on("focus", () => console.log("focused"));
  }
});
```

## 9. Framework Integration Notes

If you use React/Vue/Angular wrappers, they still rely on browser-served TrueRTE assets.

Recommended approach:

1. Self-host `truerte` assets in a predictable path (for example `/truerte`).
2. Configure wrapper/base URL options to that path.
3. Keep plugin and toolbar defaults centralized in one wrapper component/module.

## 10. TypeScript

The package includes type definitions:

```text
node_modules/truerte/js/truerte/truerte.d.ts
```

Basic TS usage:

```ts
import "truerte";

declare const truerte: any;

truerte.init({
  selector: "#editor"
});
```

If your app manages globals differently, declare the global in your own `d.ts`.

## 11. Local Development From Source (This Monorepo)

From repository root:

```bash
corepack enable
yarn install
yarn build
```

Useful commands:

```bash
yarn start          # starts demo server (webpack dev server)
yarn dev            # faster dev pipeline
yarn test           # test suite
yarn lint           # linting
```

Build output is generated under:

```text
js/truerte/
```

## 12. Troubleshooting

## 12.1 Editor loads but icons/skins/plugins fail

- Confirm these folders are being served: `skins`, `themes`, `plugins`, `icons`, `langs`.
- Set `base_url` explicitly (for example `/truerte`).
- Open network tab and verify requested URLs exist.

## 12.2 `truerte is not defined`

- Script did not load before `truerte.init(...)`.
- Verify script URL in browser directly.
- Ensure initialization runs after script tag.

## 12.3 Plugin buttons do not appear

- Plugin name missing from `plugins`.
- Plugin script failed to load.
- Toolbar string does not include the plugin control.

## 12.4 Quirks mode / standards mode error

- Ensure your page has `<!doctype html>` at the top.

## 12.5 CSP issues

- Confirm your Content Security Policy allows script/style/font assets from your chosen host(s).

## 13. Best Practices Checklist

- Self-host assets for production apps with customizations.
- Set `base_url` explicitly in config.
- Pin exact versions in production (npm lockfile or exact CDN version).
- Centralize editor defaults (plugins, toolbar, content policy).
- Keep external plugin URLs stable and versioned.
- Monitor network errors for missing editor assets.

## 14. Minimal Production Example

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>TrueRTE Production Example</title>
  </head>
  <body>
    <textarea id="article-editor"><p>Write your article...</p></textarea>

    <script src="/truerte/truerte.min.js"></script>
    <script>
      truerte.init({
        selector: "#article-editor",
        base_url: "/truerte",
        height: 500,
        menubar: "file edit view insert format tools table help",
        plugins: "lists link table code fullscreen wordcount",
        toolbar:
          "undo redo | blocks | bold italic underline | bullist numlist | link table | fullscreen code"
      });
    </script>
  </body>
</html>
```

