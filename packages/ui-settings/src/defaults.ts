// Copyright 2017-2018 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ChainsInfo, Options } from './types';

const CHAINS: ChainsInfo = [
  {
    name: 'Development',
    chainId: 0,
    decimals: 0,
    unit: 'Unit'
  },
  {
    name: 'Local Testnet',
    chainId: 0,
    decimals: 0,
    unit: 'Unit'
  },
  {
    name: 'BBQ Birch',
    chainId: 68,
    decimals: 15,
    unit: 'BBQ'
  }
];

const ENDPOINTS: Options = [
  { text: 'BBQ Birch (hosted by Parity)', value: 'wss://substrate-rpc.parity.io/' },
  { disabled: true, text: 'Polkadot PoC-3 (hosted by Parity)', value: 'wss://polkadot-rpc.polkadot.io/' },
  { text: 'Local Node (127.0.0.1:9944)', value: 'ws://127.0.0.1:9944/' }
];

const LANGUAGES: Options = [
  { value: 'default', text: 'Default browser language (auto-detect)' }
];

const UIMODES: Options = [
  { value: 'full', text: 'Fully featured' },
  { value: 'light', text: 'Basic features only' }
];

const UITHEMES: Options = [
  { value: 'substrate', text: 'Substrate' },
  { value: 'polkadot', text: 'Polkadot' }
];

export {
  CHAINS,
  ENDPOINTS,
  LANGUAGES,
  UIMODES,
  UITHEMES
};
