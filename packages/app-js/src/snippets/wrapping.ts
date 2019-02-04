// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default `// all code is wrapped within an async closure, allowing access to:
//     api (@polkadot/api), hashing (@polkadot/util-crypto),
//     keyring (@polkadot/keyring) and util (@polkadot/util)
// (async ({ api, hashing, keyring, util }) => {
//   ... any user code is executed here ...
// })(injected);
// The api itself is exposed to the window object and you can access
// all it's methods by typing 'api' in you browser's console.

`;
