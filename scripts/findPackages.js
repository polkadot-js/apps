// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');

module.exports = function findPackages () {
  const pkgRoot = path.join(__dirname, '..', 'packages');

  return fs
    .readdirSync(pkgRoot)
    .filter((entry) => {
      const pkgPath = path.join(pkgRoot, entry);

      return !['.', '..'].includes(entry) &&
        fs.lstatSync(pkgPath).isDirectory() &&
        fs.existsSync(path.join(pkgPath, 'package.json'));
    })
    .map((dir) => {
      const jsonPath = path.join(pkgRoot, dir, 'package.json');
      const { name } = JSON.parse(
        fs.readFileSync(jsonPath).toString('utf-8')
      );

      return { dir, name };
    });
};
