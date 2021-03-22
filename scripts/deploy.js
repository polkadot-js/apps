#!/usr/bin/env node
// Copyright 2017-2021 @polkadot/apps authors & contributors
// and @canvas-ui/app authors & contributors
// SPDX-License-Identifier: Apache-2.0

const ghpages = require('gh-pages');

const options = {
  dest: '.',
  repo: `https://${process.env.GH_PAT}@github.com/${process.env.GITHUB_REPOSITORY}.git`
};

ghpages.publish('packages/app/build', options, (error) => {
  if (error) {
    process.stderr.write(`${error.message}\n`, () => process.exit(1));
  } else {
    process.stdout.write('Published\n');
  }
});
