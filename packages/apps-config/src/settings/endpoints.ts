// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TFunction } from 'i18next';
import { Option } from './types';

interface LinkOption extends Option {
  dnslink?: string;
}

interface EnvWindow {
  // eslint-disable-next-line camelcase
  process_env?: {
    WS_URL: string;
  }
}

function createDev (t: TFunction): LinkOption[] {
  return [
    {
      dnslink: 'local',
      info: 'local',
      text: t<string>('rpc.local', 'Local Node (Own, 127.0.0.1:9944)', { ns: 'apps-config' }),
      value: 'ws://127.0.0.1:9944/'
    }
  ];
}

function createLive (t: TFunction): LinkOption[] {
  return [
    {
      dnslink: 'polkadot',
      info: 'polkadot',
      text: t<string>('rpc.polkadot.parity', 'Polkadot (Live, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://rpc.polkadot.io'
    },
    {
      dnslink: 'polkadot',
      info: 'polkadot',
      text: t<string>('rpc.polkadot.w3f', 'Polkadot (Live, hosted by Web3 Foundation)', { ns: 'apps-config' }),
      value: 'wss://cc1-1.polkadot.network'
    },
    {
      dnslink: 'kusama',
      info: 'kusama',
      text: t<string>('rpc.kusama.parity', 'Kusama (Polkadot Canary, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://kusama-rpc.polkadot.io/'
    },
    {
      dnslink: 'kusama',
      info: 'kusama',
      text: t<string>('rpc.kusama.w3f', 'Kusama (Polkadot Canary, hosted by Web3 Foundation)', { ns: 'apps-config' }),
      value: 'wss://cc3-5.kusama.network/'
    },
    {
      dnslink: 'kusama',
      info: 'kusama',
      text: t<string>('rpc.kusama.ava', 'Kusama (Polkadot Canary, user-run public nodes; see https://status.cloud.ava.do/)', { ns: 'apps-config' }),
      value: 'wss://kusama.polkadot.cloud.ava.do/'
    },
    {
      dnslink: 'centrifuge',
      info: 'centrifuge',
      text: t<string>('rpc.centrifuge', 'Centrifuge (Mainnet, hosted by Centrifuge)', { ns: 'apps-config' }),
      value: 'wss://fullnode.centrifuge.io'
    },
    {
      dnslink: 'edgeware',
      info: 'edgeware',
      text: t<string>('rpc.edgeware', 'Edgeware (Mainnet, hosted by Commonwealth Labs)', { ns: 'apps-config' }),
      value: 'wss://mainnet1.edgewa.re'
    },
    {
      dnslink: 'kulupu',
      info: 'substrate',
      text: t<string>('rpc.kulupu', 'Kulupu (Kulupu Mainnet, hosted by Kulupu)', { ns: 'apps-config' }),
      value: 'wss://rpc.kulupu.network/ws'
    }
  ];
}

function createTest (t: TFunction): LinkOption[] {
  return [
    {
      dnslink: 'westend',
      info: 'westend',
      text: t<string>('rpc.westend', 'Westend (Polkadot Testnet, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://westend-rpc.polkadot.io'
    },
    {
      info: 'acala',
      text: t<string>('rpc.mandala', 'Mandala (Acala Testnet, hosted by Acala)', { ns: 'apps-config' }),
      value: 'wss://node-6684611762228215808.jm.onfinality.io/ws'
    },
    {
      info: 'edgeware',
      text: t<string>('rpc.berlin', 'Berlin (Edgeware Testnet, hosted by Commonwealth Labs)', { ns: 'apps-config' }),
      value: 'wss://berlin1.edgewa.re'
    },
    {
      info: 'substrate',
      text: t<string>('rpc.flamingfir', 'Flaming Fir (Substrate Testnet, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://substrate-rpc.parity.io/'
    },
    {
      info: 'nodle',
      text: t<string>('rpc.arcadia', 'Arcadia (Nodle Testnet, hosted by Nodle)', { ns: 'apps-config' }),
      value: 'wss://arcadia1.nodleprotocol.io/'
    },
    {
      info: 'datahighway',
      isDisabled: true,
      text: t<string>('rpc.datahighway.harbour', 'Harbour (DataHighway Testnet, hosted by MXC)', { ns: 'apps-config' }),
      value: 'wss://testnet-harbour.datahighway.com'
    }
  ];
}

function createCustom (t: TFunction): LinkOption[] {
  const WS_URL = (
    (typeof process !== 'undefined' ? process.env?.WS_URL : undefined) ||
    (typeof window !== 'undefined' ? (window as EnvWindow).process_env?.WS_URL : undefined)
  );

  return WS_URL
    ? [
      {
        isHeader: true,
        text: t<string>('rpc.custom', 'Custom environment', { ns: 'apps-config' }),
        value: ''
      },
      {
        info: 'WS_URL',
        text: t<string>('rpc.custom.entry', 'Custom {{WS_URL}}', { ns: 'apps-config', replace: { WS_URL } }),
        value: WS_URL
      }
    ]
    : [];
}

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../logos, specifically in namedLogos
//   text: The text to display on teh dropdown
//   value: The actual hosted secure websocket endpoint
export default function create (t: TFunction): LinkOption[] {
  return [
    ...createCustom(t),
    {
      isHeader: true,
      text: t<string>('rpc.header.live', 'Live networks', { ns: 'apps-config' }),
      value: ''
    },
    ...createLive(t),
    {
      isHeader: true,
      text: t<string>('rpc.header.test', 'Test networks', { ns: 'apps-config' }),
      value: ''
    },
    ...createTest(t),
    {
      isHeader: true,
      text: t<string>('rpc.header.dev', 'Development', { ns: 'apps-config' }),
      value: ''
    },
    ...createDev(t)
  ].filter(({ isDisabled }) => !isDisabled);
}
