// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Option } from './types';

import { CUSTOM_ENDPOINT_KEY } from './constants';

export interface LinkOption extends Option {
  dnslink?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  textBy: string;
}

interface EnvWindow {
  // eslint-disable-next-line camelcase
  process_env?: {
    WS_URL: string;
  }
}

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

function createOwn (t: TFunction): LinkOption[] {
  try {
    const storedItems = localStorage.getItem(CUSTOM_ENDPOINT_KEY);

    if (storedItems) {
      const items = JSON.parse(storedItems) as string[];

      return items.map((textBy) => ({
        info: 'local',
        text: t('rpc.custom.entry', 'Custom', { ns: 'apps-config' }),
        textBy,
        value: textBy
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
      text: t('rpc.local', 'Local Node', { ns: 'apps-config' }),
      textBy: '127.0.0.1:9944',
      value: 'ws://127.0.0.1:9944'
    }
  ];
}

function createLiveNetworks (t: TFunction): LinkOption[] {
  return [
    // fixed, polkadot
    {
      dnslink: 'polkadot',
      info: 'polkadot',
      text: t('rpc.polkadot.parity', 'Polkadot', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Parity' } }),
      value: 'wss://rpc.polkadot.io'
    },
    {
      info: 'polkadot',
      text: t('rpc.polkadot.w3f', 'Polkadot', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Web3 Foundation' } }),
      value: 'wss://cc1-1.polkadot.network'
    },
    {
      dnslink: 'kusama',
      info: 'kusama',
      text: t('rpc.kusama.parity', 'Kusama', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Parity' } }),
      value: 'wss://kusama-rpc.polkadot.io'
    },
    {
      info: 'kusama',
      text: t('rpc.kusama.w3f', 'Kusama', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Web3 Foundation' } }),
      value: 'wss://cc3-5.kusama.network'
    },
    {
      info: 'kusama',
      isDisabled: true,
      text: t('rpc.kusama.ava', 'Kusama', { ns: 'apps-config' }),
      textBy: t('rpc.ava.summary', 'user-run public nodes; see https://status.cloud.ava.do/', { ns: 'apps-config' }),
      value: 'wss://kusama.polkadot.cloud.ava.do'
    },
    // alphabetical based on chain name
    {
      dnslink: 'centrifuge',
      info: 'centrifuge',
      text: t('rpc.centrifuge', 'Centrifuge', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Centrifuge' } }),
      value: 'wss://fullnode.centrifuge.io'
    },
    {
      info: 'crab',
      text: t('rpc.crab', 'Darwinia Crab', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Darwinia Network' } }),
      value: 'wss://crab.darwinia.network'
    },
    {
      info: 'darwinia',
      text: t('rpc.darwinia', 'Darwinia', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Darwinia Network' } }),
      value: 'wss://cc1.darwinia.network'
    },
    {
      info: 'dock-mainnet',
      text: t('rpc.dock-mainnet', 'Dock Mainnet', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Dock Association' } }),
      value: 'wss://mainnet-node.dock.io'
    },
    {
      dnslink: 'edgeware',
      info: 'edgeware',
      text: t('rpc.edgeware', 'Edgeware', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Commonwealth Labs' } }),
      value: 'wss://mainnet1.edgewa.re'
    },
    {
      info: 'equilibrium',
      text: t('rpc.equilibrium', 'Equilibrium Mainnet', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Equilibrium' } }),
      value: 'wss://tge.equilibrium.io:9944'
    },
    {
      info: 'hanonycash',
      text: t('rpc.hanonycash', 'hanonycash', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'hanonycash' } }),
      value: 'wss://rpc.hanonycash.com'
    },
    {
      dnslink: 'kulupu',
      info: 'kulupu',
      text: t('rpc.kulupu', 'Kulupu', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Kulupu' } }),
      value: 'wss://rpc.kulupu.corepaper.org/ws'
    },
    {
      info: 'nodle',
      text: t('rpc.nodle-main', 'Nodle Main', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Nodle' } }),
      value: 'wss://main1.nodleprotocol.io'
    },
    {
      info: 'plasm',
      text: t('rpc.plasm', 'Plasm', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Stake Technologies' } }),
      value: 'wss://rpc.plasmnet.io/'
    },
    {
      info: 'stafi',
      text: t('rpc.stafi', 'Stafi', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Stafi Foundation' } }),
      value: 'wss://mainnet-rpc.stafi.io'
    },
    {
      info: 'subsocial',
      text: t('rpc.subsocial', 'Subsocial', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'DappForce' } }),
      value: 'wss://rpc.subsocial.network'
    }
  ];
}

function createTestNetworks (t: TFunction): LinkOption[] {
  return [
    {
      info: 'metablockchain-runtime',
      text: t('rpc.metablockchain', 'metablockchain-runtime', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Metablockchain' } }),
      value: 'ws://ec2-52-76-185-53.ap-southeast-1.compute.amazonaws.com:9944'
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
        text: t('rpc.custom', 'Custom environment', { ns: 'apps-config' }),
        textBy: '',
        value: ''
      },
      {
        info: 'WS_URL',
        text: t('rpc.custom.entry', 'Custom {{WS_URL}}', { ns: 'apps-config', replace: { WS_URL } }),
        textBy: WS_URL,
        value: WS_URL
      }
    ]
    : [];
}

export function createEndpoints (t: TFunction): LinkOption[] {
  return [
    ...createCustom(t),
    {
      isHeader: true,
      text: t('rpc.header.live', 'Live networks', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createLiveNetworks(t),
    {
      isHeader: true,
      text: t('rpc.header.test', 'Test networks', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createTestNetworks(t),
    {
      isDevelopment: true,
      isHeader: true,
      text: t('rpc.header.dev', 'Development', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createDev(t),
    ...createOwn(t)
  ].filter(({ isDisabled }) => !isDisabled);
}
