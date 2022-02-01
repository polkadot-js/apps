// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import CrustPinner from '@crustio/crust-pin';
import pinataSDK from '@pinata/sdk';
import cloudflare from 'dnslink-cloudflare';
import fs from 'fs';

import execSync from '@polkadot/dev/scripts/execSync.mjs';

import { createWsEndpoints } from '../packages/apps-config/build/endpoints/index.cjs';

console.log('$ scripts/ipfsUpload.mjs', process.argv.slice(2).join(' '));

// https://gateway.pinata.cloud/ipfs/
const GATEWAY = 'https://ipfs.io/ipfs/';
const DOMAIN = 'dotapps.io';
const DST = 'packages/apps/build';
const SRC = 'packages/apps/public';
const WOPTS = { encoding: 'utf8', flag: 'w' };
const PINMETA = { name: DOMAIN };

const repo = `https://${process.env.GH_PAT}@github.com/${process.env.GITHUB_REPOSITORY}.git`;

function createPinata () {
  try {
    return pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);
  } catch {
    console.error('Unable to create Pinata');
  }

  return null;
}

function createCrust () {
  try {
    // eslint-disable-next-line new-cap
    return new CrustPinner.default(process.env.CRUST_SEEDS);
  } catch {
    console.error('Unable to create Crust');
  }

  return null;
}

const pinata = createPinata();
const crust = createCrust();

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
  if (!pinata) {
    console.error('Pinata not available, cannot pin');

    return;
  }

  // 1. Pin on pinata
  const result = await pinata.pinFromFS(DST, { pinataMetadata: PINMETA });
  const url = `${GATEWAY}${result.IpfsHash}/`;
  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Redirecting to ipfs gateway</title>
    <meta http-equiv="refresh" content="0; url=${url}" />
    <style>
      body { font-family: 'Nunito Sans',sans-serif; line-height: 1.5rem; padding: 2rem; text-align: center }
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

  // 2. Decentralized pin on Crust
  if (crust) {
    await crust.pin(result.IpfsHash).catch(console.error);
  }

  console.log(`Pinned ${result.IpfsHash}`);

  return result.IpfsHash;
}

async function unpin (exclude) {
  if (!pinata) {
    console.error('Pinata not available, cannot unpin');

    return;
  }

  const result = await pinata.pinList({ metadata: PINMETA, status: 'pinned' });

  if (result.count > 1) {
    const filtered = result.rows
      .map((r) => r.ipfs_pin_hash)
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
  const records = createWsEndpoints(() => '')
    .map((e) => e.dnslink)
    .reduce((all, dnslink) => {
      if (dnslink && !all.includes(dnslink)) {
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
  const pkgJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  // only run on non-beta versions
  if (!pkgJson.version.includes('-')) {
    console.log('Pinning');

    const hash = await pin();

    await dnslink(hash);
    await unpin(hash);

    console.log('Completed');
  } else {
    console.log('Skipping');
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
