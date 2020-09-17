// Copyright 2017-2020 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Snippet } from '@polkadot/app-js/types';

// We must fix this :(
/* eslint-disable sort-keys */

export const rpcNetworkAuthoring: Snippet = {
  value: 'rpcNetworkAuthoring',
  text: 'Get authoring information',
  label: { color: 'pink', children: 'RPC', size: 'tiny' },
  code: `// Returns all pending extrinsics, potentially grouped by sender
const unsub = await api.rpc.author.pendingExtrinsics((extrinsics) => {
  if(extrinsics.length === 0){
    console.log('No pending extrinsics');
    return;
  }
  console.log(extrinsics);
});`
};

export const rpcNewHead: Snippet = {
  value: 'rpcListenToHead',
  text: 'Listen to new Head',
  label: { color: 'pink', children: 'RPC', size: 'tiny' },
  code: `// subscribe to new headers, printing the full info for 5 Blocks
let count = 0;
const unsub = await api.rpc.chain.subscribeNewHeads((header) => {
  console.log(\`#\${header.number}:\`, header);

  if (++count === 5) {
    console.log('5 headers retrieved, unsubscribing');
    unsub();
  }
});`
};

export const rpcQueryState: Snippet = {
  value: 'rpcQueryState',
  text: 'Get state metadata',
  label: { color: 'pink', children: 'RPC', size: 'tiny' },
  code: `// retrieve and log the complete metadata of your node
const metadata = await api.rpc.state.getMetadata();

console.log('version: ' + metadata.version);
console.log('formatted: ' + JSON.stringify(metadata.asLatest.toHuman(), null, 2));
`
};

export const rpcSysthemInfo: Snippet = {
  value: 'rpcSystemInfo',
  text: 'Get system information',
  label: { color: 'pink', children: 'RPC', size: 'tiny' },
  code: `// Retrieve the chain & node information information via rpc calls
const [chain, nodeName, nodeVersion, properties] = await Promise.all([
  api.rpc.system.chain(),
  api.rpc.system.name(),
  api.rpc.system.version(),
  api.rpc.system.properties()
]);
console.log('You are connected to chain ' + chain)
console.log('You are using: ' + nodeName + ' v' + nodeVersion);

if (properties.size > 0) {
  console.log('Node specific properties:');
  properties.forEach((value, key) => {
    console.log(key, value);
  });
} else {
  console.log('No specific chain properties found.');
}`
};
