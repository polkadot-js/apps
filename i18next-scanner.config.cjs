// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const typescript = require('typescript');

const findPackages = require('./scripts/findPackages.cjs');

function transform (file, enc, done) {
  const { ext } = path.parse(file.path);

  if (ext === '.tsx') {
    const { outputText } = typescript.transpileModule(fs.readFileSync(file.path, enc), {
      compilerOptions: { target: 'es2018' },
      fileName: path.basename(file.path)
    });

    this.parser.parseFuncFromString(outputText, (key, options) => {
      options.defaultValue = key;

      if (process.platform !== 'win32') {
        options.ns = /packages\/(.*?)\/src/g.exec(file.path)[1].replace('page-', 'app-');
      } else {
        options.ns = /packages\\(.*?)\\src/g.exec(file.path)[1].replace('page-', 'app-');
      }

      this.parser.set(key, options);
    });
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
    debug: false, // true to print config
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
