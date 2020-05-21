// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const cloudflare = require('dnslink-cloudflare');
const execSync = require('@polkadot/dev/scripts/execSync');

// https://gateway.pinata.cloud/ipfs/
const GATEWAY = 'https://ipfs.io/ipfs/';
const DOMAIN = 'dotapps.io';
const DST = 'packages/apps/build';
const SRC = 'packages/apps/public';
const WOPTS = { encoding: 'utf8', flag: 'w' };

const token = process.env.GH_PAT || `x-access-token:${process.env.GITHUB_TOKEN}`;
const repo = `https://${token}@github.com/${process.env.GITHUB_REPOSITORY}.git`;
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

function writeFiles (name, content) {
  [DST, SRC].forEach((root) =>
    fs.writeFileSync(`${root}/ipfs/${name}`, content, WOPTS)
  );
}

function updateGh (hash) {
  execSync('git add --all .');
  execSync(`git commit --no-status --quiet -m "[CI Skip] ${hash}


skip-checks: true"`);
  execSync(`git push ${repo} HEAD:${process.env.GITHUB_REF}`, true);
}

async function pin () {
  const result = await pinata.pinFromFS(DST);
  const url = `${GATEWAY}${result.IpfsHash}/`;
  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Redirecting to ipfs gateway</title>
    <meta http-equiv="refresh" content="0; url=${url}" />
    <style>
      body { font-family: sans-serif; line-height: 1.5rem; padding: 2rem; text-align: center }
      p { margin: 0 }
    </style>
  </head>
  <body>
    <p>Redirecting to</p>
    <p><a href="${url}">${url}</a></p>
  </body>
</html>`;

  writeFiles('index.html', html);
  writeFiles('pin.json', JSON.stringify(result));
  updateGh(result.IpfsHash);

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

async function dnslink (hash) {
  await cloudflare.update(
    { token: process.env.CF_API_TOKEN },
    { link: `/ipfs/${hash}`, record: `_dnslink.${DOMAIN}`, zone: DOMAIN }
  );

  console.log(`Dnslink ${hash}`);
}

async function main () {
  const hash = await pin();

  await dnslink(hash);
  await unpin(hash);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
