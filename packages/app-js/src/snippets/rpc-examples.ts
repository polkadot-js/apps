// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Snippet } from '@polkadot/app-js/types';

export const rpcNetworkAuthoring: Snippet = {
  value: 'rpcNetworkAuthoring',
  text: 'RPC - Get authoring information',
  code: `// Returns all pending extrinsics, potentially grouped by sender
const unsub = await api.rpc.author.pendingExtrinsics((extrinsics) => {
  if(extrinsics.length === 0){
    console.log('No pending extrinsics');
    return;
  }
  console.log(extrinsics.map(extrinsic => ('Pending extrinsic' + extrinsic)));
});`
};

export const rpcNewHead: Snippet = {
  value: 'rpcListenToHead',
  text: 'RPC - Listen to new Head',
  code: `// subscribe to new headers, printing the full info for 5 Blocks
let count = 0;
const unsub = await api.rpc.chain.subscribeNewHead((header) => {
  console.log(\`#\${header.blockNumber}:\`, header);

  if (++count === 5) {
    console.log('5 headers retrieved, unsubscribing');
    unsub();
  }
});`
};

export const rpcQueryState: Snippet = {
  value: 'rpcQueryState',
  text: 'RPC - Get authoring iformation',
  code: `// subscribe to new headers, printing the full info for 5 Blocks
const unsub = await api.rpc.state.getMetadata(({ magicNumber, metadata }) => {
  console.log( 'Magic number: ' + magicNumber );
  console.log( 'Metadata: ' + metadata.raw );
});`
};

export const rpcSysthemInfo: Snippet = {
  value: 'rpcSysthemInfo',
  text: 'RPC - Get system information',
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
