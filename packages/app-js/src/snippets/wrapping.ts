// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default function makeWrapper (isDevelopment: boolean): string {
  const args = `api, hashing, ${isDevelopment ? 'keyring, ' : ''}types, util`;

  return `// All code is wrapped within an async closure,
// allowing access to ${args}.
// (async ({ ${args} }) => {
//   ... any user code is executed here ...
// })();

`;
}
