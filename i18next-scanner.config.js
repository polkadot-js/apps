// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const fs = require('fs');
const path = require('path');
const typescript = require('typescript');

const findPackages = require('./scripts/findPackages');

function transform (file, enc, done) {
  const { ext } = path.parse(file.path);

  if (ext === '.tsx') {
    const content = fs.readFileSync(file.path, enc);

    const { outputText } = typescript.transpileModule(content, {
      compilerOptions: {
        target: 'es2018'
      },
      fileName: path.basename(file.path)
    });

    const parserHandler = (key, options) => {
      options.defaultValue = key;

      if (process.platform !== 'win32') {
        options.ns = /packages\/(.*?)\/src/g.exec(file.path)[1].replace('page-', 'app-');
      } else {
        options.ns = /packages\\(.*?)\\src/g.exec(file.path)[1].replace('page-', 'app-');
      }

      this.parser.set(key, options);
    };

    this.parser.parseFuncFromString(outputText, parserHandler);
  }

  done();
}

module.exports = {
  input: [
    'packages/*/src/**/*.{ts,tsx}',
    // Use ! to filter out files or directories
    '!packages/*/src/**/*.spec.{ts,tsx}',
    '!packages/*/src/i18n/**',
    '!**/node_modules/**'
  ],
  options: {
    debug: true,
    defaultLng: 'en',
    func: {
      extensions: ['.tsx', '.ts'],
      list: ['t', 'i18next.t', 'i18n.t']
    },
    keySeparator: false, // key separator
    lngs: ['en'],
    ns: findPackages().map(({ dir }) => dir.replace('page-', 'app-')),
    nsSeparator: false, // namespace separator
    resource: {
      jsonIndent: 2,
      lineEnding: '\n',
      loadPath: 'packages/apps/public/locales/{{lng}}/{{ns}}.json',
      savePath: 'packages/apps/public/locales/{{lng}}/{{ns}}.json'
    },
    trans: {
      component: 'Trans'
    }
  },
  output: './',
  transform
};
