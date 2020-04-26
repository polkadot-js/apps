// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const fs = require('fs');
const path = require('path');

const i18nRoot = path.join(__dirname, '../packages/apps/public/locales');

function getEntries (langRoot) {
  return fs
    .readdirSync(langRoot)
    .filter((entry) =>
      !['.', '..'].includes(entry) &&
      fs.lstatSync(path.join(langRoot, entry)).isFile() &&
      entry.endsWith('.json') &&
      !['app-i18n.json', 'index.json'].includes(entry)
    )
    .sort();
}

function sortLanguage (lang) {
  const langRoot = path.join(i18nRoot, lang);
  const entries = getEntries(langRoot);

  entries.forEach((entry) => {
    const filename = path.join(langRoot, entry);
    const json = require(filename);
    const sorted = Object.keys(json).sort().reduce((result, key) => {
      result[key] = json[key];

      return result;
    }, {});

    fs.writeFileSync(filename, JSON.stringify(sorted, null, 2));
  });

  fs.writeFileSync(
    path.join(langRoot, 'index.json'),
    JSON.stringify(entries.filter((entry) => !['translation.json'].includes(entry)), null, 2)
  );
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
