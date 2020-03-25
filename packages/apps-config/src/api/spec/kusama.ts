// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// technically these don't need to be here, the API injects them - however it does make
// certain things easier such as providing metadata + types to external signers
export default {
  Address: 'AccountId',
  Keys: 'SessionKeys5',
  LookupSource: 'AccountId'
};
