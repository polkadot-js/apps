// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const fs = require('fs');
const pinataSDK = require('@pinata/sdk');
const cloudflare = require('dnslink-cloudflare');
const execSync = require('@polkadot/dev/scripts/execSync');

const createEndpoints = require('../packages/apps-config/build/settings/endpoints').default;
const lernaInfo = require('../lerna.json');

// https://gateway.pinata.cloud/ipfs/
const GATEWAY = 'https://ipfs.io/ipfs/';
const DOMAIN = 'dotapps.io';
const DST = 'packages/apps/build';
const SRC = 'packages/apps/public';
const WOPTS = { encoding: 'utf8', flag: 'w' };
const PINMETA = { name: DOMAIN };

const repo = `https://${process.env.GH_PAT}@github.com/${process.env.GITHUB_REPOSITORY}.git`;
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

function writeFiles (name, content) {
  [DST, SRC].forEach((root) =>
    fs.writeFileSync(`${root}/ipfs/${name}`, content, WOPTS)
  );
}

function updateGh (hash) {
  execSync('git add --all .');
  execSync(`git commit --no-status --quiet -m "[CI Skip] publish/ipfs ${hash}


skip-checks: true"`);
  execSync(`git push ${repo} HEAD:${process.env.GITHUB_REF}`, true);
}

async function pin () {
  const result = await pinata.pinFromFS(DST, { pinataMetadata: PINMETA });
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
  const result = await pinata.pinList({ metadata: PINMETA, status: 'pinned' });

  if (result.count > 1) {
    const filtered = result.rows
      .map(({ ipfs_pin_hash: hash }) => hash)
      .filter((hash) => hash !== exclude);

    if (filtered.length) {
      await Promise.all(
        filtered.map((hash) =>
          pinata
            .unpin(hash)
            .then(() => console.log(`Unpinned ${hash}`))
            .catch(console.error)
        )
      );
    }
  }
}

async function dnslink (hash) {
  const records = createEndpoints(() => '')
    .map(({ dnslink }) => dnslink)
    .filter((dnslink) => !!dnslink)
    .reduce((all, dnslink) => {
      if (!all.includes(dnslink)) {
        all.push(dnslink);
      }

      return all;
    }, [null])
    .map((sub) =>
      ['_dnslink', sub, DOMAIN]
        .filter((entry) => !!entry)
        .join('.')
    );

  await Promise.all(records.map((record) =>
    cloudflare(
      { token: process.env.CF_API_TOKEN },
      { link: `/ipfs/${hash}`, record, zone: DOMAIN }
    )
  ));

  console.log(`Dnslink ${hash} for ${records.join(', ')}`);
}

async function main () {
  // only run on non-beta versions
  if (!lernaInfo.version.includes('-beta.')) {
    const hash = await pin();

    await dnslink(hash);
    await unpin(hash);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());
