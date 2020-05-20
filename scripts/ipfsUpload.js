// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const fs = require('fs');
const deploy = require('ipfs-deploy');

const credentials = {
  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    secretApiKey: process.env.PINATA_SECRET_KEY
  }
};

const options = {
  copyHttpGatewayUrlToClipboard: false,
  credentials,
  dnsProviders: [],
  open: false,
  publicDirPath: 'packages/apps/build',
  remotePinners: ['pinata'], // ['pinata', 'infura'],
  uniqueUpload: ['pinata']
};

async function main () {
  const pinnedHash = await deploy(options);
  const url = `https://ipfs.io/ipfs/${pinnedHash}/`; // `https://gateway.pinata.cloud/ipfs/${pinnedHash}/`;
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

  fs.writeFileSync('packages/apps/build/ipfs/index.html', html);
  fs.writeFileSync(`packages/apps/build/ipfs/${pinnedHash}.ipfs`, pinnedHash);

  console.log(`Deployed to ${url}`);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
