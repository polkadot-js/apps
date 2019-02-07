// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Snippet } from '@polkadot/app-js/types';

const rpcNewHead: Snippet = {
  value: 'RpcListenToHead',
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

export default rpcNewHead;
