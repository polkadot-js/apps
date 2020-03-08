// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from './types';

const DEV: Option[] = [
  {
    info: 'local',
    text: 'Local Node (Own, 127.0.0.1:9944)',
    value: 'ws://127.0.0.1:9944/'
  }
];

const LIVE: Option[] = [
  {
    info: 'kusama',
    text: 'Kusama (Polkadot Canary, hosted by Parity)',
    value: 'wss://kusama-rpc.polkadot.io/'
  },
  {
    info: 'kusama',
    text: 'Kusama (Polkadot Canary, hosted by Web3 Foundation)',
    value: 'wss://cc3-5.kusama.network/'
  },
  {
    info: 'edgeware',
    text: 'Edgeware (Edgeware Mainnet, hosted by Commonwealth Labs)',
    value: 'wss://mainnet1.edgewa.re'
  },
  {
    info: 'substrate',
    text: 'Kulupu (Kulupu Mainnet, hosted by Kulupu)',
    value: 'wss://rpc.kulupu.network/ws'
  }
];

const TEST: Option[] = [
  {
    info: 'westend',
    text: 'Westend (Polkadot Testnet, hosted by Parity)',
    value: 'wss://westend-rpc.polkadot.io'
  },
  {
    info: 'edgeware',
    text: 'Berlin (Edgeware Testnet, hosted by Commonwealth Labs)',
    value: 'wss://berlin1.edgewa.re'
  },
  {
    info: 'substrate',
    text: 'Flaming Fir (Substrate Testnet, hosted by Parity)',
    value: 'wss://substrate-rpc.parity.io/'
  }
];

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../logos, specifically in namedLogos
//   text: The text to display on teh dropdown
//   value: The actual hosted secure websocket endpoint
export default [
  {
    isHeader: true,
    text: 'Live networks',
    value: -1
  },
  ...LIVE,
  {
    isHeader: true,
    text: 'Test networks',
    value: -1
  },
  ...TEST,
  {
    isHeader: true,
    text: 'Development',
    value: -1
  },
  ...DEV
].map((option): Option => ({ ...option, withI18n: true }));
