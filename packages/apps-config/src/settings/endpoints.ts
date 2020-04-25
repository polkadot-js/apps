// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from './types';

function createDev (t: (key: string, options: { ns: string }) => string): Option[] {
  return [
    {
      info: 'local',
      text: t('Local Node (Own, 127.0.0.1:9944)', { ns: 'apps-config' }),
      value: 'ws://127.0.0.1:9944/'
    }
  ];
}

function createLive (t: (key: string, options: { ns: string }) => string): Option[] {
  return [
    {
      info: 'kusama',
      text: t('Kusama (Polkadot Canary, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://kusama-rpc.polkadot.io/'
    },
    {
      info: 'kusama',
      text: t('Kusama (Polkadot Canary, hosted by Web3 Foundation)', { ns: 'apps-config' }),
      value: 'wss://cc3-5.kusama.network/'
    },
    {
      info: 'kusama',
      text: t('Kusama (Polkadot Canary, user-run public nodes; see https://status.cloud.ava.do/)', { ns: 'apps-config' }),
      value: 'wss://kusama.polkadot.cloud.ava.do/'
    },
    {
      info: 'edgeware',
      text: t('Edgeware (Edgeware Mainnet, hosted by Commonwealth Labs)', { ns: 'apps-config' }),
      value: 'wss://mainnet1.edgewa.re'
    },
    {
      info: 'substrate',
      text: t('Kulupu (Kulupu Mainnet, hosted by Kulupu)', { ns: 'apps-config' }),
      value: 'wss://rpc.kulupu.network/ws'
    }
  ];
}

function createTest (t: (key: string, options: { ns: string }) => string): Option[] {
  return [
    {
      info: 'westend',
      text: t('Westend (Polkadot Testnet, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://westend-rpc.polkadot.io'
    },
    {
      info: 'edgeware',
      text: t('Berlin (Edgeware Testnet, hosted by Commonwealth Labs)', { ns: 'apps-config' }),
      value: 'wss://berlin1.edgewa.re'
    },
    {
      info: 'substrate',
      text: t('Flaming Fir (Substrate Testnet, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://substrate-rpc.parity.io/'
    }
  ];
}

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../logos, specifically in namedLogos
//   text: The text to display on teh dropdown
//   value: The actual hosted secure websocket endpoint
export default function create (t: (key: string, options: { ns: string }) => string): Option[] {
  const ENV: Option[] = [];
  const WS_URL = process.env.WS_URL || (window as any).process_env?.WS_URL;

  if (WS_URL) {
    ENV.push({
      info: 'WS_URL',
      text: 'WS_URL: ' + WS_URL,
      value: WS_URL
    });
  }

  let endpoints = [
    {
      isHeader: true,
      text: t('Live networks', { ns: 'apps-config' }),
      value: ''
    },
    ...createLive(t),
    {
      isHeader: true,
      text: t('Test networks', { ns: 'apps-config' }),
      value: ''
    },
    ...createTest(t),
    {
      isHeader: true,
      text: t('Development', { ns: 'apps-config' }),
      value: ''
    },
    ...createDev(t)
  ];

  if (ENV.length > 0) {
    endpoints = [
      {
        isHeader: true,
        text: t('Custom ENV', { ns: 'apps-config' }),
        value: ''
      },
      ...ENV
    ].concat(endpoints);
  }

  return endpoints;
}
