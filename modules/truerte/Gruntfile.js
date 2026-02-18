/*eslint-env node */
const { string: PluginString } = require('rollup-plugin-string');
const FilesAsStrings = PluginString({
  include: '**/*.svg'
});

let zipUtils = require('./tools/modules/zip-helper');
let gruntUtils = require('./tools/modules/grunt-utils');
let gruntWebPack = require('./tools/modules/grunt-webpack');
let swag = require('@ephox/swag');
let path = require('path');

let plugins = [
  'accordion', 'advlist', 'anchor', 'autolink', 'autoresize', 'autosave', 'charmap', 'code', 'codesample',
  'casechange', 'directionality', 'emoticons', 'help', 'fullscreen', 'image', 'importcss', 'insertdatetime',
  'letterspacing', 'lucideicons', 'link', 'lists', 'media', 'nonbreaking', 'pagebreak', 'paragraphspacing', 'preview', 'save', 'searchreplace',
  'table', 'template', 'visualblocks', 'visualchars', 'wordcount', 'quickbars'
];

let themes = [
  'silver'
];

let models = [
  'dom',
];

let oxideUiSkinMap = {
  'dark': 'oxide-dark',
  'default': 'oxide',
  'truerte-5': 'truerte-5',
  'truerte-5-dark': 'truerte-5-dark'
};

const stripSourceMaps = function (data) {
  const sourcemap = data.lastIndexOf('/*# sourceMappingURL=');
  return sourcemap > -1 ? data.slice(0, sourcemap) : data;
};

module.exports = function (grunt) {
  const packageData = grunt.file.readJSON('package.json');

  // Determine the release date
  const dateRe = new RegExp('^##\\s+' + packageData.version.toString().replace(/\./g, '\\.') + '\\s+\\-\\s+([\\d-]+)$', 'm');
  const changelog = grunt.file.read('CHANGELOG.md').toString();
  const dateMatch = dateRe.exec(changelog);
  if (dateMatch !== null) {
    packageData.date = dateMatch[1];
  } else {
    packageData.date = 'TBD';
  }

  grunt.initConfig({
    pkg: packageData,

    shell: {
      prismjs: { command: 'node ./bin/build-prism.js', cwd: '../../' },
      tsc: { command: 'tsc -b' },
      moxiedoc: { command: 'moxiedoc "src/core/main/ts" -t truertenext --fail-on-warning --dry' }
    },

    eslint: {
      target: [ 'src/**/*.ts' ]
    },

    globals: {
      options: {
        configFile: 'src/core/main/json/globals.json',
        outputDir: 'lib/globals',
        templateFile: 'src/core/main/js/GlobalsTemplate.js'
      }
    },

    rollup: Object.assign(
      {
        core: {
          options: {
            treeshake: true,
            format: 'iife',
            onwarn: swag.onwarn,
            plugins: [
              FilesAsStrings,
              swag.nodeResolve({
                basedir: __dirname,
                prefixes: {
                  'truerte/core': 'lib/core/main/ts'
                }
              }),
              swag.remapImports()
            ]
          },
          files:[
            {
              src: 'lib/core/main/ts/api/Main.js',
              dest: 'js/truerte/truerte.js'
            }
          ]
        },
        'core-types': {
          options: {
            treeshake: true,
            format: 'es',
            onwarn: (warning) => {
              // Ignore circular deps in types
              if (warning.code !== 'CIRCULAR_DEPENDENCY') {
                swag.onwarn(warning)
              }
            },
            plugins: [
              FilesAsStrings,
              swag.dts({
                respectExternal: true,
                keepVariables: [ 'truerte' ],
                keepComments: false
              })
            ]
          },
          files: [
            {
              src: 'lib/core/main/ts/api/PublicApi.d.ts',
              dest: 'js/truerte/truerte.d.ts'
            }
          ]
        }
      },
      gruntUtils.generate(plugins, 'plugin', (name) => {
        return {
          options: {
            treeshake: true,
            format: 'iife',
            onwarn: swag.onwarn,
            plugins: [
              FilesAsStrings,
              swag.nodeResolve({
                basedir: __dirname,
                prefixes: gruntUtils.prefixes({
                  'truerte/core': 'lib/globals/truerte/core'
                }, [
                  [`truerte/plugins/${name}`, `lib/plugins/${name}/main/ts`]
                ]),
                mappers: [
                  swag.mappers.replaceDir('./lib/core/main/ts/api', './lib/globals/truerte/core/api'),
                  swag.mappers.invalidDir('./lib/core/main/ts')
                ]
              }),
              swag.remapImports()
            ]
          },
          files:[ { src: `lib/plugins/${name}/main/ts/Main.js`, dest: `js/truerte/plugins/${name}/plugin.js` } ]
        };
      }),
      gruntUtils.generate(themes, 'theme', (name) => {
        return {
          options: {
            treeshake: true,
            format: 'iife',
            onwarn: swag.onwarn,
            plugins: [
              FilesAsStrings,
              swag.nodeResolve({
                basedir: __dirname,
                prefixes: gruntUtils.prefixes({
                  'truerte/core': 'lib/globals/truerte/core'
                }, [
                  [`truerte/themes/${name}/resources`, `src/themes/${name}/main/resources`],
                  [`truerte/themes/${name}`, `lib/themes/${name}/main/ts`]
                ]),
                mappers: [
                  swag.mappers.replaceDir('./lib/core/main/ts/api', './lib/globals/truerte/core/api'),
                  swag.mappers.invalidDir('./lib/core/main/ts')
                ]
              }),
              swag.remapImports()
            ]
          },
          files:[
            {
              src: `lib/themes/${name}/main/ts/Main.js`,
              dest: `js/truerte/themes/${name}/theme.js`
            }
          ]
        };
      }),
      gruntUtils.generate(models, 'model', (name) => {
        return {
          options: {
            treeshake: true,
            format: 'iife',
            onwarn: swag.onwarn,
            plugins: [
              FilesAsStrings,
              swag.nodeResolve({
                basedir: __dirname,
                prefixes: gruntUtils.prefixes({
                  'truerte/core': 'lib/globals/truerte/core'
                }, [
                  [`truerte/models/${name}`, `lib/models/${name}/main/ts`]
                ]),
                mappers: [
                  swag.mappers.replaceDir('./lib/core/main/ts/api', './lib/globals/truerte/core/api'),
                  swag.mappers.invalidDir('./lib/core/main/ts')
                ]
              }),
              swag.remapImports()
            ]
          },
          files:[
            {
              src: `lib/models/${name}/main/ts/Main.js`,
              dest: `js/truerte/models/${name}/model.js`
            }
          ]
        };
      })
    ),

    emojis: {
      twemoji: {
        base: '',
        ext: '.png'
      }
    },

    terser: Object.assign(
      {
        options: {
          ecma: 2018,
          output: {
            comments: 'all',
            ascii_only: true
          },
          compress: {
            passes: 2
          }
        },
        core: {
          files: [
            { src: 'js/truerte/truerte.js', dest: 'js/truerte/truerte.min.js' },
            { src: 'js/truerte/icons/default/icons.js', dest: 'js/truerte/icons/default/icons.min.js' },
            { src: 'js/truerte/icons/truerte-lucide/icons.js', dest: 'js/truerte/icons/truerte-lucide/icons.min.js' },
          ]
        },
        // very similar to the emoticons plugin, except mangle is off
        'emoticons-raw': {
          options: {
            mangle: false,
            compress: false,
            output: {
              indent_level: 2
            }
          },
          files: [
            { src: 'src/plugins/emoticons/main/js/emojis.js', dest: 'js/truerte/plugins/emoticons/js/emojis.js' },
            { src: 'src/plugins/emoticons/main/js/emojiimages.js', dest: 'js/truerte/plugins/emoticons/js/emojiimages.js' }
          ]
        }
      },
      gruntUtils.generate(plugins, 'plugin', (name) => {
        var pluginExtras = {
          emoticons: [
            { src: 'src/plugins/emoticons/main/js/emojis.js', dest: 'js/truerte/plugins/emoticons/js/emojis.min.js' },
            { src: 'src/plugins/emoticons/main/js/emojiimages.js', dest: 'js/truerte/plugins/emoticons/js/emojiimages.min.js' }
          ]
        };
        return {
          files: [
            { src: `js/truerte/plugins/${name}/plugin.js`, dest: `js/truerte/plugins/${name}/plugin.min.js` }
          ].concat(pluginExtras.hasOwnProperty(name) ? pluginExtras[name] : [])
        };
      }),
      gruntUtils.generate(themes, 'theme', (name) => {
        return {
          files: [ { src: `js/truerte/themes/${name}/theme.js`, dest: `js/truerte/themes/${name}/theme.min.js` } ]
        };
      }),
      gruntUtils.generate(models, 'model', (name) => {
        return {
          files: [ { src: `js/truerte/models/${name}/model.js`, dest: `js/truerte/models/${name}/model.min.js` } ]
        };
      })
    ),

    'webpack-dev-server': {
      everything: () => gruntWebPack.all(plugins, themes, models),
      options: {
        devServer: {
          port: grunt.option('webpack-port') !== undefined ? grunt.option('webpack-port') : 3000,
          host: '0.0.0.0',
          allowedHosts: 'all',
          static: {
            publicPath: '/',
            directory: path.join(__dirname)
          },
          hot: false,
          liveReload: false,
          setupMiddlewares: (middlewares, devServer) => {
            gruntWebPack.generateDemoIndex(grunt, devServer.app, plugins, themes, models);
            return middlewares;
          }
        }
      },
    },

    concat: Object.assign({
        options: {
          process: function(content) {
            return content.
              replace(/@@version@@/g, packageData.version).
              replace(/@@releaseDate@@/g, packageData.date);
          }
        },
        core: {
          src: [
            'src/core/text/build-header.js',
            'src/core/text/dompurify-license-header.js',
            'js/truerte/truerte.js'
          ],
          dest: 'js/truerte/truerte.js'
        }
      },
      gruntUtils.generate(plugins, 'plugin', function (name) {
        return {
          src: [
            'src/core/text/build-header.js',
            name === 'codesample' ? 'src/core/text/prismjs-license-header.js' : null,
            `js/truerte/plugins/${name}/plugin.js`
          ].filter(Boolean),
          dest: `js/truerte/plugins/${name}/plugin.js`
        };
      }),
      gruntUtils.generate(themes, 'theme', function (name) {
        return {
          src: [
            'src/core/text/build-header.js',
            name === 'silver' ? 'src/core/text/dompurify-license-header.js' : null,
            `js/truerte/themes/${name}/theme.js`
          ].filter(Boolean),
          dest: `js/truerte/themes/${name}/theme.js`
        };
      }),
      gruntUtils.generate(models, 'model', function (name) {
        return {
          src: [
            'src/core/text/build-header.js',
            `js/truerte/models/${name}/model.js`
          ],
          dest: `js/truerte/models/${name}/model.js`
        };
      })
    ),

    copy: {
      core: {
        options: {
          process: function (content) {
            return content.
              replace('@@majorVersion@@', packageData.version.split('.')[0]).
              replace('@@minorVersion@@', packageData.version.split('.').slice(1).join('.')).
              replace('@@releaseDate@@', packageData.date);
          }
        },
        files: [
          {
            src: 'js/truerte/truerte.js',
            dest: 'js/truerte/truerte.js'
          },
          {
            src: 'js/truerte/truerte.min.js',
            dest: 'js/truerte/truerte.min.js'
          },
          {
            src: 'src/core/main/text/readme_lang.md',
            dest: 'js/truerte/langs/README.md'
          },
          {
            src: '../../LICENSE.TXT',
            dest: 'js/truerte/license.txt'
          },
          {
            src: '../../README.md',
            dest: 'js/truerte/README.md'
          }
        ]
      },
      'default-icons': {
        options: {
          process: function (content, srcpath) {
            if (/icons(\.min)?\.js$/.test(srcpath)) {
              return content.replace(/\bhugerte\.IconManager\b/g, 'truerte.IconManager');
            }
            return content;
          }
        },
        files: [
          {
            expand: true,
            cwd: '../oxide-icons-default/dist/icons/default',
            src: '**',
            dest: 'js/truerte/icons/default'
          }
        ]
      },
      'truerte-lucide-icons': {
        files: [
          {
            expand: true,
            cwd: 'src/icons/truerte-lucide',
            src: '**',
            dest: 'js/truerte/icons/truerte-lucide'
          }
        ]
      },
      'ui-skins': {
        files: gruntUtils.flatMap(oxideUiSkinMap, function (name, mappedName) {
          return [
            {
              expand: true,
              cwd: '../oxide/build/skins/ui/' + name,
              src: '**',
              dest: 'js/truerte/skins/ui/' + mappedName
            }
          ];
        })
      },
      'content-skins': {
        files: [
          {
            expand: true,
            cwd: '../oxide/build/skins/content',
            src: '**',
            dest: 'js/truerte/skins/content'
          },
        ]
      },
      'visualblocks-plugin': {
        files: [
          { src: 'src/plugins/visualblocks/main/css/visualblocks.css', dest: 'js/truerte/plugins/visualblocks/css/visualblocks.css' }
        ]
      },
      'html-i18n': {
        files: [
          {
            expand: true,
            cwd: 'src/plugins/help/main/js/i18n/keynav',
            src: '**',
            dest: 'js/truerte/plugins/help/js/i18n/keynav'
          }
        ]
      }
    },

    moxiezip: {
      production: {
        options: {
          baseDir: 'truerte',
          excludes: [
            'js/**/plugin.js',
            'js/**/theme.js',
            'js/**/model.js',
            'js/**/icons.js',
            'js/**/*.map',
            'js/truerte/truerte.full.min.js',
            'js/truerte/plugins/moxiemanager',
            'js/truerte/plugins/visualblocks/img',
            'js/truerte/README.md',
            'README.md'
          ],
          to: 'dist/truerte_<%= pkg.version %>.zip',
          dataFilter: (args) => {
            if (args.filePath.endsWith('.min.css')) {
              args.data = stripSourceMaps(args.data);
            }
          }
        },
        src: [
          'js/truerte/langs',
          'js/truerte/plugins',
          'js/truerte/skins/**/*.js',
          'js/truerte/skins/**/*.min.css',
          'js/truerte/skins/**/*.woff',
          'js/truerte/icons',
          'js/truerte/themes',
          'js/truerte/models',
          'js/truerte/truerte.d.ts',
          'js/truerte/truerte.min.js',
          'js/truerte/license.txt',
          'CHANGELOG.md',
          'LICENSE.TXT',
          'README.md'
        ]
      },

      development: {
        options: {
          baseDir: 'truerte',
          excludes: [
            '../../modules/*/dist',
            '../../modules/*/build',
            '../../modules/*/scratch',
            '../../modules/*/lib',
            '../../modules/*/tmp',
            '../../modules/truerte/js/truerte/truerte.full.min.js',
            '../../scratch',
            '../../node_modules'
          ],
          to: 'dist/truerte_<%= pkg.version %>_dev.zip'
        },
        files: [
          {
            expand: true,
            cwd: '../../',
            src: [
              'modules/*/src',
              'modules/*/CHANGELOG.md',
              'modules/*/Gruntfile.js',
              'modules/*/gulpfile.js',
              'modules/*/README.md',
              'modules/*/README.md',
              'modules/*/package.json',
              'modules/*/tsconfig*.json',
              'modules/*/.eslint*.json',
              'modules/*/webpack.config.js',
              'modules/*/.stylelintignore',
              'modules/*/.stylelintrc',
              'modules/truerte/tools',
              'bin',
              'patches',
              '.yarnrc',
              'LICENSE.TXT',
              'README.md',
              'lerna.json',
              'package.json',
              'tsconfig*.json',
              '.eslint*.json',
              'yarn.lock'
            ]
          },
          {
            expand: true,
            cwd: '../../',
            src: 'modules/truerte/js',
            dest: '/',
            flatten: true
          }
        ]
      },

      cdn: {
        options: {
          onBeforeSave: function (zip) {
            zip.addData('dist/version.txt', packageData.version);
          },
          pathFilter: function (zipFilePath) {
            return zipFilePath.replace('js/truerte/', 'dist/');
          },
          dataFilter: (args) => {
            if (args.filePath.endsWith('.min.css')) {
              args.data = stripSourceMaps(args.data);
            }
          },
          onBeforeConcat: function (destPath, chunks) {
            // Strip the license from each file and prepend the license, so it only appears once
            var license = grunt.file.read('src/core/text/build-header.js').replace(/@@version@@/g, packageData.version).replace(/@@releaseDate@@/g, packageData.date);
            return [license].concat(chunks.map(function (chunk) {
              return chunk.replace(license, '').trim();
            }));
          },
          excludes: [
            'js/**/config',
            'js/**/scratch',
            'js/**/classes',
            'js/**/lib',
            'js/**/dependency',
            'js/**/src',
            'js/**/*.less',
            'js/**/*.dev.js',
            'js/**/*.dev.svg',
            'js/**/*.map',
            'js/truerte/truerte.full.min.js',
            'js/truerte/plugins/moxiemanager',
            'js/truerte/plugins/visualblocks/img',
            'js/truerte/README.md',
            'README.md',
            'js/tests/.jshintrc'
          ],
          concat: [
            {
              src: [
                'js/truerte/truerte.d.ts',
                'js/truerte/truerte.min.js',
                'js/truerte/themes/*/theme.min.js',
                'js/truerte/models/*/model.min.js',
                'js/truerte/plugins/*/plugin.min.js',
                '!js/truerte/plugins/example/plugin.min.js',
                '!js/truerte/plugins/example_dependency/plugin.min.js'
              ],

              dest: [
                'js/truerte/truerte.min.js'
              ]
            },
          ],
          to: 'dist/truerte_<%= pkg.version %>_cdn.zip'
        },
        src: [
          'js/truerte/truerte.js',
          'js/truerte/langs',
          'js/truerte/plugins',
          'js/truerte/skins',
          'js/truerte/icons',
          'js/truerte/themes',
          'js/truerte/models',
          'js/truerte/license.txt'
        ]
      },

      component: {
        options: {
          excludes: [
            'js/**/config',
            'js/**/scratch',
            'js/**/classes',
            'js/**/lib',
            'js/**/dependency',
            'js/**/src',
            'js/**/*.less',
            'js/**/*.dev.svg',
            'js/**/*.dev.js',
            'js/**/*.map',
            'js/truerte/truerte.full.min.js',
            'js/truerte/plugins/moxiemanager',
            'js/truerte/plugins/example',
            'js/truerte/plugins/example_dependency',
            'js/truerte/plugins/visualblocks/img'
          ],
          pathFilter: function (zipFilePath) {
            if (zipFilePath.indexOf('js/truerte/') === 0) {
              return zipFilePath.substr('js/truerte/'.length);
            }

            return zipFilePath;
          },
          onBeforeSave: function (zip) {
            function jsonToBuffer(json) {
              return new Buffer(JSON.stringify(json, null, '\t'));
            }

            const keywords = ['wysiwyg', 'truerte', 'richtext', 'javascript', 'html', 'text', 'rich editor', 'rich text editor', 'rte', 'rich text', 'contenteditable', 'editing']

            zip.addData('bower.json', jsonToBuffer({
              'name': 'truerte',
              'description': 'Web based JavaScript HTML WYSIWYG editor control.',
              'license': 'MIT',
              'keywords': keywords,
              'homepage': 'https:/truerte.org/',
              'ignore': ['README.md', 'composer.json', 'package.json', '.npmignore', 'CHANGELOG.md']
            }));

            zip.addData('package.json', jsonToBuffer({
              'name': 'truerte',
              'version': packageData.version,
              'repository': {
                'type': 'git',
                'url': 'https://github.com/truerte/truerte.git',
                'directory': 'modules/truerte'
              },
              'funding': {
                'type': 'opencollective',
                'url': 'https://opencollective.com/truerte'
              },
              'description': 'Web based JavaScript HTML WYSIWYG editor control.',
              'author': 'Ephox Corporation DBA Tiny Technologies, Inc and the TrueRTE contributors',
              'main': 'truerte.js',
              'types': 'truerte.d.ts',
              'license': 'MIT',
              'keywords': keywords,
              'homepage': 'https://truerte.org/',
              'bugs': { 'url': 'https://github.com/truerte/truerte/issues' }
            }));

            zip.addData('composer.json', jsonToBuffer({
              'name': 'truerte/truerte',
              'version': packageData.version,
              'description': 'Web based JavaScript HTML WYSIWYG editor control.',
              'license': ['MIT'],
              'keywords': keywords,
              'homepage': 'https://truerte.org/',
              'type': 'component',
              'funding': [
                {
                  'type': 'opencollective',
                  'url': 'https://opencollective.com/truerte'
                }
              ],
              'extra': {
                'component': {
                  'scripts': [
                    'truerte.js',
                    'plugins/*/plugin.js',
                    'themes/*/theme.js',
                    'models/*/model.js',
                    'icons/*/icons.js',
                  ],
                  'files': [
                    'truerte.min.js',
                    'plugins/*/plugin.min.js',
                    'themes/*/theme.min.js',
                    'models/*/model.min.js',
                    'skins/**',
                    'icons/*/icons.min.js'
                  ]
                }
              },
              'archive': {
                'exclude': ['README.md', 'bower.js', 'package.json', '.npmignore', 'CHANGELOG.md']
              }
            }));

            var getDirs = zipUtils.getDirectories(grunt, this.excludes);

            zipUtils.addIndexFiles(
              zip,
              getDirs('js/truerte/plugins'),
              zipUtils.generateIndex('plugins', 'plugin')
            );
            zipUtils.addIndexFiles(
              zip,
              getDirs('js/truerte/themes'),
              zipUtils.generateIndex('themes', 'theme')
            );
            zipUtils.addIndexFiles(
              zip,
              getDirs('js/truerte/models'),
              zipUtils.generateIndex('models', 'model')
            );
            zipUtils.addIndexFiles(
              zip,
              getDirs('js/truerte/icons'),
              zipUtils.generateIndex('icons', 'icons')
            );
          },
          to: 'dist/truerte_<%= pkg.version %>_component.zip',
          dataFilter: (args) => {
            if (args.filePath.endsWith('.min.css')) {
              args.data = stripSourceMaps(args.data);
            }
          }
        },
        src: [
          'js/truerte/skins',
          'js/truerte/icons',
          'js/truerte/plugins',
          'js/truerte/themes',
          'js/truerte/models',
          'js/truerte/truerte.js',
          'js/truerte/truerte.d.ts',
          'js/truerte/truerte.min.js',
          'js/truerte/license.txt',
          'CHANGELOG.md',
          'js/truerte/README.md'
        ]
      }
    },

    nugetpack: {
      main: {
        options: {
          id: 'TrueRTE',
          version: packageData.version,
          authors: 'Ephox Corporation DBA Tiny Technologies, Inc',
          owners: 'Ephox Corporation DBA Tiny Technologies, Inc',
          description: 'The best WYSIWYG editor! TrueRTE is an open source platform independent web based Javascript HTML WYSIWYG editor ' +
          'control forked by the TrueRTE contributors from the latest MIT-licensed version of the TinyMCE editor released by Tiny Technologies, Inc. ' +
          'TrueRTE has the ability to convert HTML TEXTAREA fields or other HTML elements to editor instances. TrueRTE is very easy to integrate ' +
          'into other Content Management Systems.',
          releaseNotes: 'Release notes for my package.',
          summary: 'TrueRTE is a platform independent web based Javascript HTML WYSIWYG editor ' +
          'control released as Open Source under MIT.',
          projectUrl: 'https://truerte.org/',
          //iconUrl: 'https://www.tiny.cloud/favicon-32x32.png',
          licenseUrl: 'https://github.com/truerte/truerte/blob/main/LICENSE.TXT',
          requireLicenseAcceptance: true,
          tags: 'Editor TrueRTE HTML HTMLEditor',
          excludes: [
            'js/**/config',
            'js/**/scratch',
            'js/**/classes',
            'js/**/lib',
            'js/**/dependency',
            'js/**/src',
            'js/**/*.less',
            'js/**/*.dev.svg',
            'js/**/*.dev.js',
            'js/**/*.map',
            'js/truerte/truerte.full.min.js'
          ],
          outputDir: 'dist'
        },
        files: [
          { src: 'js/truerte/langs', dest: '/content/scripts/truerte/langs' },
          { src: 'js/truerte/plugins', dest: '/content/scripts/truerte/plugins' },
          { src: 'js/truerte/themes', dest: '/content/scripts/truerte/themes' },
          { src: 'js/truerte/models', dest: '/content/scripts/truerte/models' },
          { src: 'js/truerte/skins', dest: '/content/scripts/truerte/skins' },
          { src: 'js/truerte/icons', dest: '/content/scripts/truerte/icons' },
          { src: 'js/truerte/truerte.js', dest: '/content/scripts/truerte/truerte.js' },
          { src: 'js/truerte/truerte.d.ts', dest: '/content/scripts/truerte/truerte.d.ts' },
          { src: 'js/truerte/truerte.min.js', dest: '/content/scripts/truerte/truerte.min.js' },
          { src: 'js/truerte/license.txt', dest: '/content/scripts/truerte/license.txt' },
          { src: 'tools/nuget/build/TrueRTE.targets', dest: '/build/TrueRTE.targets' }
        ]
      },
    },

    bundle: {
      minified: {
        options: {
          themesDir: 'js/truerte/themes',
          modelsDir: 'js/truerte/models',
          pluginsDir: 'js/truerte/plugins',
          iconsDir: 'js/truerte/icons',
          pluginFileName: 'plugin.min.js',
          themeFileName: 'theme.min.js',
          modelFileName: 'model.min.js',
          iconsFileName: 'icons.min.js',
          outputPath: 'js/truerte/truerte.full.min.js'
        },

        src: [
          'js/truerte/truerte.min.js'
        ]
      },

      source: {
        options: {
          themesDir: 'js/truerte/themes',
          modelsDir: 'js/truerte/models',
          pluginsDir: 'js/truerte/plugins',
          iconsDir: 'js/truerte/icons',
          pluginFileName: 'plugin.js',
          themeFileName: 'theme.js',
          modelFileName: 'model.js',
          iconsFileName: 'icons.js',
          outputPath: 'js/truerte/truerte.full.js'
        },

        src: [
          'js/truerte/truerte.js'
        ]
      }
    },

    symlink: {
      options: {
        overwrite: true,
        force: true
      },
      dist: {
        src: 'dist',
        dest: '../../dist'
      },
      js: {
        src: 'js',
        dest: '../../js'
      }
    },

    clean: {
      dist: ['js'],
      lib: ['lib'],
      scratch: ['scratch'],
      release: ['dist']
    },

    'bedrock-manual': {
      core: {
        config: 'tsconfig.json',
        projectdir: '.',
        stopOnFailure: true,
        testfiles: [
          'src/**/test/ts/atomic/**/*Test.ts',
          'src/**/test/ts/browser/**/*Test.ts',
          'src/**/test/ts/headless/**/*Test.ts'
        ],
        customRoutes: 'src/core/test/json/routes.json'
      },
      atomic: {
        config: 'tsconfig.json',
        projectdir: '.',
        stopOnFailure: true,
        testfiles: [
          'src/**/test/ts/atomic/**/*Test.ts',
        ],
        customRoutes: 'src/core/test/json/routes.json'
      },
      silver: {
        config: 'tsconfig.json',
        testfiles: ['src/themes/silver/test/ts/phantom/**/*Test.ts', 'src/themes/silver/test/ts/browser/**/*Test.ts'],
        stopOnFailure: true,
        overallTimeout: 600000,
        singleTimeout: 300000,
        customRoutes: 'src/core/test/json/routes.json',
        name: 'silver-tests'
      }
    },

    'bedrock-auto': {
      standard: {
        browser: grunt.option('bedrock-browser') !== undefined ? grunt.option('bedrock-browser') : 'chrome-headless',
        config: 'tsconfig.json',
        testfiles: ['src/**/test/ts/**/*Test.ts'],
        overallTimeout: 900000,
        singleTimeout: 30000,
        retries: 3,
        customRoutes: 'src/core/test/json/routes.json',
        name: grunt.option('bedrock-browser') !== undefined ? grunt.option('bedrock-browser') : 'chrome-headless'
      },
      silver: {
        browser: 'phantomjs',
        config: 'tsconfig.json',
        testfiles: ['src/themes/silver/test/ts/phantom/**/*Test.ts', 'src/themes/silver/test/ts/browser/**/*Test.ts', 'src/themes/silver/test/ts/webdriver/*/*Test.ts'],
        stopOnFailure: true,
        overallTimeout: 600000,
        singleTimeout: 300000,
        customRoutes: 'src/core/test/json/routes.json',
        name: 'silver-tests'
      }
    }
  });

  grunt.registerTask('symlink-dist', 'Links built dist content to the root directory', function () {
    // Copy built artifacts to the repo root paths for local/dev packaging.
    const fs = require('fs');
    const path = require('path');
    const removePath = (targetPath) => {
      try {
        const stat = fs.lstatSync(targetPath);
        if (stat.isSymbolicLink()) {
          fs.unlinkSync(targetPath);
        } else {
          fs.rmSync(targetPath, { recursive: true, force: true });
        }
      } catch (e) {
        if (e.code !== 'ENOENT') {
          throw e;
        }
      }
    };

    const moduleDist = path.resolve(__dirname, 'dist');
    const moduleJs = path.resolve(__dirname, 'js');
    const rootDist = path.resolve(__dirname, '../../dist');
    const rootJs = path.resolve(__dirname, '../../js');

    removePath(rootDist);
    removePath(rootJs);
    fs.cpSync(moduleDist, rootDist, { recursive: true, force: true });
    fs.cpSync(moduleJs, rootJs, { recursive: true, force: true });
    grunt.log.write('Copied 2 directories');
  });

  grunt.registerTask('version', 'Creates a version file', function () {
    grunt.file.write('dist/version.txt', packageData.version);
  });

  require('load-grunt-tasks')(grunt, {
    requireResolution: true,
    config: "../../package.json",
    pattern: ['grunt-*', '@ephox/bedrock-server', '@ephox/swag']
  });
  grunt.loadTasks('tools/tasks');

  grunt.registerTask('emoji', ['emojis', 'terser:emoticons-raw']);

  grunt.registerTask('prodBuild', [
    'shell:prismjs',
    'shell:tsc',
    //'eslint',
    'globals',
    'emoji',
    'html-i18n',
    'rollup',
    'concat',
    'copy',
    'terser'
  ]);

  grunt.registerTask('prod', [
    'prodBuild',
    'clean:release',
    'moxiezip',
    'nugetpack',
    'symlink-dist',
    'version'
  ]);

  grunt.registerTask('dev', [
    'shell:prismjs',
    'globals',
    'emoji',
    'html-i18n',
    // TODO: Make webpack use the oxide CSS directly
    // as well as making development easier, then we can update 'yarn dev' to run 'oxide-build' in parallel with 'truerte-grunt dev'
    // that will save 2-3 seconds on incremental builds
    'copy:ui-skins',
    'copy:content-skins',
    'copy:default-icons',
    'copy:truerte-lucide-icons',
    'copy:html-i18n'
  ]);

  grunt.registerTask('start', ['webpack-dev-server']);

  grunt.registerTask('default', ['clean:dist', 'prod']);
  grunt.registerTask('test', ['bedrock-auto:standard']);
  grunt.registerTask('test-manual', ['bedrock-manual']);
};
