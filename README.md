# TrueRTE

The open source MIT-licensed rich text editor for modern web apps.

**Using an older version of TrueRTE?** Upgrade to the latest release to stay current with fixes and improvements.

TrueRTE is a powerful WYSIWYG HTML editor and TinyMCE 6 fork built for teams that want a self-hosted, customizable, and fully MIT-licensed rich text editor. It is designed for product teams building document editors, CMS workflows, knowledge bases, forms, and content authoring experiences in JavaScript and TypeScript applications.

Originally based on [TinyMCE](https://github.com/tinymce/tinymce), TrueRTE preserves an MIT-only path for developers who need an open source rich text editor with long-term flexibility.

## Get Started with TrueRTE

Getting started with the TrueRTE rich text editor is straightforward for both npm and self-hosted setups.

[TrueRTE Installation and Usage Guide](./docs/INSTALLATION_AND_USAGE.md)

You can quickly configure TrueRTE for common editing modes and deployment patterns:

- Iframe mode (default)
- Inline editing mode
- Programmatic target initialization

For imperative control methods (formatting, alignment, links, tables, history), see:
[TrueRTE Imperative Editor API](./docs/IMPERATIVE_EDITOR_API.md)

## Features

### Integration

TrueRTE is built for web application integration and supports:

- Direct script usage in plain HTML/JavaScript apps
- Package-based installation in npm projects
- React integration via [`truerte-react`](https://github.com/TrueRTE/truerte-react)
- Custom framework wrappers built on the core editor API

### Customization

TrueRTE is highly configurable for product-specific editing experiences:

- Toolbar and menu customization
- Plugin-driven feature loading
- Custom external plugins
- Icon pack selection (including Lucide icon support)
- Theming with skins/content CSS assets

See configuration and plugin setup examples in:
[Installation and Usage](./docs/INSTALLATION_AND_USAGE.md)

### Extensibility

TrueRTE is open source and designed to be extended for unique editing workflows:

- Add custom commands and plugins
- Register custom toolbar/menu UI
- Build domain-specific editing features
- Automate formatting workflows through the editor API

## Compiling and Contributing

In 2019, upstream moved to a monorepo architecture, and TrueRTE follows the same development model.

For local builds, testing, and contribution workflow, see:
[Contributing Guidelines](./CONTRIBUTING.md)

## Want More Information?

Project documentation:

- Complete guide: [Installation and Usage](./docs/INSTALLATION_AND_USAGE.md)
- Imperative API guide: [Imperative Editor API](./docs/IMPERATIVE_EDITOR_API.md)

Source repositories:

- Core editor: [TrueRTE/truerte](https://github.com/TrueRTE/truerte)
- React wrapper: [TrueRTE/truerte-react](https://github.com/TrueRTE/truerte-react)

## License

[MIT](LICENSE.TXT)
