// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');

const i18nRoot = path.join(__dirname, '../packages/apps/public/locales');

const SKIP_NS = ['translation'].map((f) => `${f}.json`);

function getEntries (langRoot) {
  return fs
    .readdirSync(langRoot)
    .filter((entry) =>
      !['.', '..'].includes(entry) &&
      fs.lstatSync(path.join(langRoot, entry)).isFile() &&
      entry.endsWith('.json') &&
      !['index.json'].includes(entry)
    )
    .sort();
}

function sortLanguage (lang) {
  const langRoot = path.join(i18nRoot, lang);
  const entries = getEntries(langRoot);
  const hasKeys = {};

  entries.forEach((entry) => {
    const filename = path.join(langRoot, entry);
    const json = require(filename);
    const sorted = Object.keys(json).sort().reduce((result, key) => {
      result[key] = json[key];

      return result;
    }, {});

    hasKeys[entry] = Object.keys(sorted).length !== 0;

    fs.writeFileSync(filename, JSON.stringify(sorted, null, 2));
  });

  if (lang === 'en') {
    const filtered = entries
      .filter((entry) => !SKIP_NS.includes(entry))
      .filter((entry) => hasKeys[entry]);

    fs.writeFileSync(
      path.join(langRoot, 'index.json'),
      JSON.stringify(filtered, null, 2)
    );
  }
}

function checkLanguages () {
  const languages = fs
    .readdirSync(i18nRoot)
    .filter((entry) =>
      !['.', '..'].includes(entry) &&
      fs.lstatSync(path.join(i18nRoot, entry)).isDirectory()
    )
    .sort();

  languages.forEach(sortLanguage);

  fs.writeFileSync(path.join(i18nRoot, 'index.json'), JSON.stringify(languages, null, 2));
}

checkLanguages();
