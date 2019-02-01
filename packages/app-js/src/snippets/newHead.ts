// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default `// subscribe to new headers, printing the full result
api.rpc.chain.subscribeNewHead((header) => {
  console.log(\`#\${header.blockNumber}:\`, header);
});`;
