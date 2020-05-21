// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const execSync = require('@polkadot/dev/scripts/execSync');

const lerna = require('../lerna.json');

// https://gateway.pinata.cloud/ipfs/
const GATEWAY = 'https://ipfs.io/ipfs/';
const DST = 'packages/apps/build';
const SRC = 'packages/apps/public';
const WOPTS = { encoding: 'utf8', flag: 'w' };

const token = process.env.GH_PAT || `x-access-token:${process.env.GITHUB_TOKEN}`;
const repo = `https://${token}@github.com/${process.env.GITHUB_REPOSITORY}.git`;
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

async function pin () {
  const result = await pinata.pinFromFS(DST);
  const url = `${GATEWAY}${result.IpfsHash}/`;
  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Redirecting to latest deployed IPFS instance</title>
    <meta http-equiv="refresh" content="0; url=${url}" />
  </head>
  <body>
    <p>Redirecting you to <a href="${url}">${url}</a></p>
  </body>
</html>`;
  const pinFile = JSON.stringify({ ...result, version: lerna.json });

  // write the redirect
  fs.writeFileSync(`${DST}/ipfs/index.html`, html, WOPTS);
  fs.writeFileSync(`${SRC}/ipfs/index.html`, html, WOPTS);

  // write the pin info
  fs.writeFileSync(`${DST}/ipfs/pin.json`, pinFile, WOPTS);
  fs.writeFileSync(`${SRC}/ipfs/pin.json`, pinFile, WOPTS);

  execSync('git add --all .');
  execSync(`git commit --no-status --quiet -m "[CI Skip] ${result.IpfsHash}


skip-checks: true"`);
  execSync(`git push ${repo} HEAD:${process.env.GITHUB_REF}`, true);

  console.log(`Pinned ${result.IpfsHash}`);

  return result.IpfsHash;
}

async function unpin (exclude) {
  const result = await pinata.pinList({ status: 'pinned' });

  if (result.count > 1) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const filtered = result.rows.map(({ ipfs_pin_hash }) => ipfs_pin_hash).filter((hash) => hash !== exclude);

    if (filtered.length) {
      await Promise.all(
        filtered.map((hash) => pinata.unpin(hash).then(() => console.log(`Unpinned ${hash}`)))
      );
    }
  }
}

pin()
  .then(unpin)
  .catch(console.error)
  .finally(() => process.exit());
