// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const fs = require('fs');
const path = require('path');

const defaults = {};
const i18nRoot = path.join(__dirname, '../packages/apps/public/locales');

function getEntries (langRoot) {
  return fs
    .readdirSync(langRoot)
    .filter((entry) =>
      !['.', '..'].includes(entry) &&
      fs.lstatSync(path.join(langRoot, entry)).isFile() &&
      entry.endsWith('.json') &&
      !['index.json', 'translation.json'].includes(entry)
    )
    .sort();
}

function checkLanguage (lang) {
  console.log(`*** Checking ${lang}`);

  const langRoot = path.join(i18nRoot, lang);
  const entries = getEntries(langRoot);
  const roots = Object.keys(defaults);
  const missing = roots.filter((entry) => !entries.includes(entry));

  if (missing.length) {
    console.log(`\ttop-level missing ${missing.length}: ${missing.join(', ')}`);
  }

  entries.forEach((entry) => {
    const json = require(path.join(langRoot, entry));
    const keys = Object.keys(json);
    const root = defaults[entry];

    if (!root) {
      console.log(`\t> ${entry} not found in default, not checking`);

      return;
    }

    const missing = root.filter((key) => !keys.includes(key));
    const extra = keys.filter((key) => !root.includes(key));

    if (missing.length) {
      console.log(`\t> ${entry} ${missing.length} keys missing`);

      missing.forEach((key) =>
        console.log(`\t\t${key}`)
      );
    }

    if (extra.length) {
      console.log(`\t> ${entry} ${extra.length} keys extra`);

      extra.forEach((key) =>
        console.log(`\t\t${key}`)
      );
    }
  });
}

function checkLanguages () {
  fs
    .readdirSync(i18nRoot)
    .filter((entry) =>
      !['.', '..'].includes(entry) &&
      fs.lstatSync(path.join(i18nRoot, entry)).isDirectory() &&
      entry !== 'en'
    )
    .sort()
    .forEach(checkLanguage);
}

function initDefault () {
  const enRoot = path.join(i18nRoot, 'en');

  getEntries(enRoot).forEach((entry) => {
    const json = require(path.join(enRoot, entry));
    const keys = Object.keys(json);

    // if (keys.length > 0) {
    //   console.log(`${entry} ${keys.length} keys`);
    // }

    defaults[entry] = keys;
  });
}

initDefault();
checkLanguages();
