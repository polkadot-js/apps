// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Snippet } from '@polkadot/app-js/types';

const rpcSysthemInfo: Snippet = {
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
  }
  `
};
export default rpcSysthemInfo;
