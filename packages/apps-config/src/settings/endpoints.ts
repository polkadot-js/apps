// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TFunction } from 'i18next';
import { Option } from './types';

import { CUSTOM_ENDPOINT_KEY } from './constants';

export interface LinkOption extends Option {
  dnslink?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
}

interface EnvWindow {
  // eslint-disable-next-line camelcase
  process_env?: {
    WS_URL: string;
  }
}

function createOwn (t: TFunction): LinkOption[] {
  try {
    const storedItems = localStorage.getItem(CUSTOM_ENDPOINT_KEY);

    if (storedItems) {
      const items = JSON.parse(storedItems) as string[];

      return items.map((item) => ({
        info: 'local',
        text: t<string>('rpc.custom.entry', 'Custom (custom, {{WS_URL}})', { ns: 'apps-config', replace: { WS_URL: item } }),
        value: item
      }));
    }
  } catch (e) {
    console.error(e);
  }

  return [];
}

function createDev (t: TFunction): LinkOption[] {
  return [
    {
      dnslink: 'local',
      info: 'local',
      text: t<string>('rpc.local', 'Local Node (Own, 127.0.0.1:9944)', { ns: 'apps-config' }),
      value: 'ws://127.0.0.1:9944'
    }
  ];
}

function createLive (t: TFunction): LinkOption[] {
  return [
    // fixed, polkadot
    {
      dnslink: 'polkadot',
      info: 'polkadot',
      text: t<string>('rpc.polkadot.parity', 'Polkadot (Live, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://rpc.polkadot.io'
    },
    {
      info: 'polkadot',
      text: t<string>('rpc.polkadot.w3f', 'Polkadot (Live, hosted by Web3 Foundation)', { ns: 'apps-config' }),
      value: 'wss://cc1-1.polkadot.network'
    },
    {
      dnslink: 'kusama',
      info: 'kusama',
      text: t<string>('rpc.kusama.parity', 'Kusama (Polkadot Canary, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://kusama-rpc.polkadot.io'
    },
    {
      info: 'kusama',
      text: t<string>('rpc.kusama.w3f', 'Kusama (Polkadot Canary, hosted by Web3 Foundation)', { ns: 'apps-config' }),
      value: 'wss://cc3-5.kusama.network'
    },
    {
      info: 'kusama',
      isDisabled: true,
      text: t<string>('rpc.kusama.ava', 'Kusama (Polkadot Canary, user-run public nodes; see https://status.cloud.ava.do/)', { ns: 'apps-config' }),
      value: 'wss://kusama.polkadot.cloud.ava.do'
    },
    // alphabetical based on chain name
    {
      dnslink: 'centrifuge',
      info: 'centrifuge',
      text: t<string>('rpc.centrifuge', 'Centrifuge (Mainnet, hosted by Centrifuge)', { ns: 'apps-config' }),
      value: 'wss://fullnode.centrifuge.io'
    },
    {
      info: 'crab',
      text: t<string>('rpc.crab', 'Darwinia Crab (Darwinia Canary, hosted by Darwinia Network)', { ns: 'apps-config' }),
      value: 'wss://crab.darwinia.network'
    },
    {
      dnslink: 'edgeware',
      info: 'edgeware',
      text: t<string>('rpc.edgeware', 'Edgeware (Mainnet, hosted by Commonwealth Labs)', { ns: 'apps-config' }),
      value: 'wss://mainnet1.edgewa.re'
    },
    {
      dnslink: 'kulupu',
      info: 'kulupu',
      text: t<string>('rpc.kulupu', 'Kulupu (Kulupu Mainnet, hosted by Kulupu)', { ns: 'apps-config' }),
      value: 'wss://rpc.kulupu.corepaper.org/ws'
    },
    {
      info: 'nodle',
      text: t<string>('rpc.nodle-main', 'Nodle Main (Nodle Mainnet, hosted by Nodle)', { ns: 'apps-config' }),
      value: 'wss://main1.nodleprotocol.io'
    },
    {
      info: 'subsocial',
      text: t<string>('rpc.subsocial', 'Subsocial (Subsocial Network, hosted by DappForce)', { ns: 'apps-config' }),
      value: 'wss://rpc.subsocial.network'
    }
  ];
}

function createTest (t: TFunction): LinkOption[] {
  return [
    // polkadot
    {
      dnslink: 'rococo',
      info: 'rococo',
      text: t<string>('rpc.rococo', 'Rococo (Polkadot Testnet, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://rococo-rpc.polkadot.io'
    },
    {
      info: 'rococoTick',
      isChild: true,
      text: t<string>('rpc.rococo.tick', 'Tick (Polkadot Testpara, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://tick-rpc.polkadot.io'
    },
    {
      info: 'rococoTrick',
      isChild: true,
      text: t<string>('rpc.rococo.trick', 'Trick (Polkadot Testpara, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://trick-rpc.polkadot.io'
    },
    {
      info: 'rococoTrack',
      isChild: true,
      text: t<string>('rpc.rococo.track', 'Track (Polkadot Testpara, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://track-rpc.polkadot.io'
    },
    {
      info: 'rococoAcala',
      isChild: true,
      text: t<string>('rpc.rococo.acala', 'Mandala PC1 (Acala Testpara, hosted by Acala)', { ns: 'apps-config' }),
      value: 'wss://rococo-1.acala.laminar.one'
    },
    {
      info: 'rococoLaminar',
      isChild: true,
      text: t<string>('rpc.rococo.laminar', 'Turbulence PC1 (Laminar Testpara, hosted by Laminar)', { ns: 'apps-config' }),
      value: 'wss://rococo-1.laminar-chain.laminar.one'
    },
    {
      dnslink: 'westend',
      info: 'westend',
      text: t<string>('rpc.westend', 'Westend (Polkadot Testnet, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://westend-rpc.polkadot.io'
    },
    // alphabetical based on chain name
    {
      info: 'centrifuge',
      text: t<string>('rpc.amber', 'Amber (Centrifuge Testnet, hosted by Centrifuge)', { ns: 'apps-config' }),
      value: 'wss://fullnode.amber.centrifuge.io'
    },
    {
      info: 'nodle',
      text: t<string>('rpc.nodle-arcadia', 'Arcadia (Nodle Testnet, hosted by Nodle)', { ns: 'apps-config' }),
      value: 'wss://arcadia1.nodleprotocol.io'
    },
    {
      info: 'edgeware',
      text: t<string>('rpc.beresheet', 'Beresheet (Edgeware Testnet, hosted by Commonwealth Labs)', { ns: 'apps-config' }),
      value: 'wss://beresheet1.edgewa.re'
    },
    {
      info: 'substrate',
      text: t<string>('rpc.flamingfir', 'Flaming Fir (Substrate Testnet, hosted by Parity)', { ns: 'apps-config' }),
      value: 'wss://substrate-rpc.parity.io'
    },
    {
      info: 'datahighway',
      isDisabled: true,
      text: t<string>('rpc.datahighway.harbour', 'Harbour (DataHighway Testnet, hosted by MXC)', { ns: 'apps-config' }),
      value: 'wss://testnet-harbour.datahighway.com'
    },
    {
      info: 'acala',
      text: t<string>('rpc.mandala', 'Mandala (Acala Testnet, hosted by Acala)', { ns: 'apps-config' }),
      value: 'wss://node-6684611762228215808.jm.onfinality.io/ws'
    },
    {
      info: 'kilt',
      text: t<string>('rpc.kilt', 'Mashnet (KILT Canary, hosted by KILT Protocol)', { ns: 'apps-config' }),
      value: 'wss://full-nodes.kilt.io:9944/'
    },
    {
      info: 'laminar',
      text: t<string>('rpc.turbulence', 'Turbulence (Laminar Testnet, hosted by Laminar)', { ns: 'apps-config' }),
      value: 'wss://testnet-node-1.laminar-chain.laminar.one/ws'
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
//   text: The text to display on the dropdown
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
      isDevelopment: true,
      isHeader: true,
      text: t<string>('rpc.header.dev', 'Development', { ns: 'apps-config' }),
      value: ''
    },
    ...createDev(t),
    ...createOwn(t)
  ].filter(({ isDisabled }) => !isDisabled);
}
