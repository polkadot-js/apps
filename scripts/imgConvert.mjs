// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import path from 'node:path';

import { formatNumber, stringCamelCase } from '@polkadot/util';

const MAX_SIZE = 48 * 1024;

// FIXME The sorting here and the sorting from linting seems like a mismatch...
const HEADER = '// Copyright 2017-2025 @polkadot/apps authors & contributors\n// SPDX-License-Identifier: Apache-2.0\n\n// Do not edit. Auto-generated via node scripts/imgConvert.mjs\n\n';

/** @type {Record<string, string>} */
const MIME = {
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml'
};

/**
 * @param {string} k
 * @param {string} contents
 * @returns {string}
 */
function makeContents (k, contents) {
  return `${HEADER}export const ${k} = '${contents}';\n`;
}

/** @type {Record<string, string>} */
const all = {};
/** @type {Record<string, number>} */
const oversized = {};

for (const dir of ['extensions', 'external', 'chains', 'nodes']) {
  const sub = path.join('packages/apps-config/src/ui/logos', dir);
  const generated = path.join(sub, 'generated');
  /** @type {Record<string, string>} */
  const result = {};

  if (fs.existsSync(generated)) {
    fs.rmSync(generated, { force: true, recursive: true });
  }

  fs.mkdirSync(generated);

  fs
    .readdirSync(sub)
    .forEach((file) => {
      const full = path.join(sub, file);

      if (fs.lstatSync(full).isFile() && !(file.endsWith('.ts') || file.startsWith('.'))) {
        const parts = file.split('.');
        const ext = parts[parts.length - 1];
        const nameParts = parts.slice(0, parts.length - 1);
        const mime = MIME[ext];

        if (!mime) {
          throw new Error(`Unable to determine mime for ${file}`);
        } else {
          const buf = fs.readFileSync(full);
          const data = `data:${mime};base64,${buf.toString('base64')}`;
          const k = `${stringCamelCase(`${dir}_${nameParts.join('_')}`)}${ext.toUpperCase()}`;
          const fileprefix = `generated/${nameParts.join('.')}${ext.toUpperCase()}`;

          fs.writeFileSync(path.join(sub, `${fileprefix}.ts`), makeContents(k, data));

          result[k] = fileprefix;
          all[k] = data;

          if (buf.length > MAX_SIZE) {
            oversized[k] = buf.length;
          }
        }
      }
    });

  if (Object.keys(result).length) {
    let srcs = '';

    for (const dir of ['endpoints', 'extensions', 'links']) {
      const srcroot = path.join('packages/apps-config/src', dir);

      fs
        .readdirSync(srcroot)
        .forEach((file) => {
          const full = path.join(srcroot, file);

          if (fs.lstatSync(full).isFile() && file.endsWith('.ts')) {
            srcs += fs.readFileSync(full).toString();
          }
        });
    }

    const notfound = Object
      .keys(result)
      .filter((k) => !srcs.includes(k));

    if (notfound.length) {
      console.log('\n', notfound.length.toString().padStart(3), 'not referenced in', dir, '::\n\n\t', notfound.join(', '), '\n');
    }

    fs.writeFileSync(path.join(sub, 'index.ts'), `${HEADER}${
      Object
        .keys(result)
        .sort((a, b) => result[a].localeCompare(result[b]))
        .map((k) => `export { ${k} } from './${result[k]}.js';`)
        .join('\n')
    }\n`);
  }
}

const allKeys = Object.keys(all);
/** @type {Record<string, string[]>} */
const dupes = {};

allKeys.forEach((a) => {
  const d = allKeys.filter((b) =>
    a !== b &&
    all[a] === all[b]
  );

  if (d.length) {
    dupes[a] = d;
  }
});

if (Object.keys(dupes).length) {
  const errMsg = `${Object.keys(dupes).length.toString().padStart(3)} dupes found`;

  console.log('\n', errMsg, '::\n');

  for (const [k, d] of Object.entries(dupes)) {
    console.log('\t', k.padStart(30), ' >> ', d.join(', '));
  }

  console.log();

  throw new Error(`FATAL: ${errMsg}. Please remove the duplicates.`);
}

const numOversized = Object.keys(oversized).length;

if (numOversized) {
  const errMsg = `${numOversized.toString().padStart(3)} files with byte sizes > 48K`;

  console.log('\n', errMsg, '::\n');

  for (const [k, v] of Object.entries(oversized)) {
    console.log('\t', k.padStart(30), formatNumber(v).padStart(15), `(+${formatNumber(v - MAX_SIZE)} bytes)`);
  }

  console.log();

  throw new Error(`FATAL: ${errMsg}. Please resize the images.`);
}
