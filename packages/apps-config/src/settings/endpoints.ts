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

const ENV: Option[] = [];
const WS_URL = process.env.WS_URL || (window as any).process_env?.WS_URL;

if (WS_URL) {
  ENV.push({
    info: 'WS_URL',
    text: 'WS_URL: ' + WS_URL,
    value: WS_URL
  });
}

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
    info: 'kusama',
    text: 'Kusama (Load balanced between user-run public nodes; see https://status.cloud.ava.do/)',
    value: 'wss://kusama.polkadot.cloud.ava.do/'
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

let endpoints = [
  {
    isHeader: true,
    text: 'Live networks',
    value: ''
  },
  ...LIVE,
  {
    isHeader: true,
    text: 'Test networks',
    value: ''
  },
  ...TEST,
  {
    isHeader: true,
    text: 'Development',
    value: ''
  },
  ...DEV
];

if (ENV.length > 0) {
  endpoints = [
    {
      isHeader: true,
      text: 'Custom ENV',
      value: ''
    },
    ...ENV
  ].concat(endpoints);
}

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../logos, specifically in namedLogos
//   text: The text to display on teh dropdown
//   value: The actual hosted secure websocket endpoint
export default endpoints.map((option): Option => ({ ...option, withI18n: true }));
