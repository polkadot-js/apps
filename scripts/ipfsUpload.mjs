// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck Currently we have a bit too many of these

import CrustPinner from '@crustio/crust-pin';
import PinataSDK from '@pinata/sdk';
// @ts-expect-error No definition file
import cloudflare from 'dnslink-cloudflare';
import fs from 'node:fs';

// @ts-expect-error No definition file
import { execSync } from '@polkadot/dev/scripts/util.mjs';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Using ignore since the file won't be there in dev
import { createWsEndpoints } from '../packages/apps-config/build/endpoints/index.js';

console.log('$ scripts/ipfsUpload.mjs', process.argv.slice(2).join(' '));

// https://gateway.pinata.cloud/ipfs/
const GATEWAY = 'https://ipfs.io/ipfs/';
const DOMAIN = 'dotapps.io';
const DST = 'packages/apps/build';
const SRC = 'packages/apps/public';
const WOPTS = { encoding: 'utf8', flag: 'w' };
const PINMETA = { name: DOMAIN };

const repo = `https://${process.env.GH_PAT}@github.com/${process.env.GITHUB_REPOSITORY}.git`;

async function wait (delay = 2500) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), delay);
  });
}

function createPinata () {
  try {
    // For 1.2.1
    return PinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);
    // For 2.1.0+
    // return new PinataSDK({
    //   pinataApiKey: process.env.PINATA_API_KEY,
    //   pinataSecretApiKey: process.env.PINATA_SECRET_KEY
    // });
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

  await wait();

  return result.IpfsHash;
}

async function unpin (exclude) {
  if (!pinata) {
    console.error('Pinata not available, cannot unpin');

    return;
  }

  const result = await pinata.pinList({ metadata: PINMETA, status: 'pinned' });

  await wait();

  console.log('Available Pinata pins', result.rows);

  if (result.count > 1) {
    const hashes = result.rows
      .map((r) => r.ipfs_pin_hash)
      .filter((hash) => hash !== exclude);

    for (let i = 0, count = hashes.length; i < count; i++) {
      const hash = hashes[i];

      try {
        await pinata.unpin(hash);

        console.log(`Unpinned ${hash}`);
      } catch (error) {
        console.error(`Failed unpinning ${hash}`, error);
      }

      await wait();
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

  for (let i = 0, count = records.length; i < count; i++) {
    const record = records[i];

    try {
      await cloudflare(
        { token: process.env.CF_API_TOKEN },
        { link: `/ipfs/${hash}`, record, zone: DOMAIN }
      );

      console.log(`Updated dnslink ${record}`);
    } catch (error) {
      console.error(`Failed updating dnslink ${record}`, error);
    }

    await wait();
  }

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
