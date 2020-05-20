// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const fs = require('fs');
const pinataSDK = require('@pinata/sdk');

const ROOT = 'packages/apps/build';

const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

async function main () {
  const result = await pinata.pinFromFS(ROOT);
  const url = `https://ipfs.io/ipfs/${result.IpfsHash}/`; // `https://gateway.pinata.cloud/ipfs/${pinnedHash}/`;
  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Redirecting to latest deployed IPFS instance</title>
    <meta http-equiv="refresh" content="2; url=${url}" />
  </head>
  <body>
    <p>Redirecting you to <a href="${url}">${url}</a></p>
  </body>
</html>`;

  fs.writeFileSync(`${ROOT}/ipfs/index.html`, html);
  fs.writeFileSync(`${ROOT}/ipfs/pin.json`, JSON.stringify(result));
  fs.writeFileSync(`${ROOT}/ipfs/${result.IpfsHash}.ipfs`, result.IpfsHash);

  console.log(`Deployed to ${url}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
