// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

export type ChainsInfo = Array<{
  name: string,
  chainId: number,
  decimals: number
}>;

export type Options = Array<{
  disabled?: boolean,
  text: string,
  value: string
}>;

const CHAINS: ChainsInfo = [
  {
    name: 'Development',
    chainId: 0,
    decimals: 0
  },
  {
    name: 'BBQ Birch',
    chainId: 68,
    decimals: 15
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
