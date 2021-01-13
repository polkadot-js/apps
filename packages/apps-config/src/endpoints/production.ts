// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

import { expandEndpoints } from './util';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

export function createProduction (t: TFunction): LinkOption[] {
  return expandEndpoints(t, [
    // fixed, polkadot
    {
      dnslink: 'polkadot',
      info: 'polkadot',
      text: t('rpc.polkadot.parity', 'Polkadot', { ns: 'apps-config' }),
      providers: {
        Parity: 'wss://rpc.polkadot.io',
        OnFinality: 'wss://polkadot.api.onfinality.io/public-ws',
        'Patract Elara': 'wss://polkadot.elara.patract.io'
      }
    },
    {
      dnslink: 'kusama',
      info: 'kusama',
      text: t('rpc.kusama.parity', 'Kusama', { ns: 'apps-config' }),
      providers: {
        Parity: 'wss://kusama-rpc.polkadot.io',
        OnFinality: 'wss://kusama.api.onfinality.io/public-ws',
        'Patract Elara': 'wss://kusama.elara.patract.io'
      }
    },
    // alphabetical based on chain name
    {
      dnslink: 'centrifuge',
      info: 'centrifuge',
      text: t('rpc.centrifuge', 'Centrifuge', { ns: 'apps-config' }),
      providers: {
        Centrifuge: 'wss://fullnode.centrifuge.io'
      }
    },
    {
      info: 'crab',
      text: t('rpc.crab', 'Darwinia Crab', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': 'wss://crab.darwinia.network'
      }
    },
    {
      info: 'darwinia',
      text: t('rpc.darwinia', 'Darwinia', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': 'wss://cc1.darwinia.network'
      }
    },
    {
      info: 'dock-mainnet',
      text: t('rpc.dock-mainnet', 'Dock Mainnet', { ns: 'apps-config' }),
      providers: {
        'Dock Association': 'wss://mainnet-node.dock.io'
      }
    },
    {
      dnslink: 'edgeware',
      info: 'edgeware',
      text: t('rpc.edgeware', 'Edgeware', { ns: 'apps-config' }),
      providers: {
        'Commonwealth Labs': 'wss://mainnet4.edgewa.re'
      }
    },
    {
      info: 'equilibrium',
      text: t('rpc.equilibrium', 'Equilibrium Mainnet', { ns: 'apps-config' }),
      providers: {
        Equilibrium: 'wss://tge.equilibrium.io'
      }
    },
    {
      info: 'hanonycash',
      text: t('rpc.hanonycash', 'Hanonycash', { ns: 'apps-config' }),
      providers: {
        Hanonycash: 'wss://rpc.hanonycash.com'
      }
    },
    {
      dnslink: 'kulupu',
      info: 'kulupu',
      text: t('rpc.kulupu', 'Kulupu', { ns: 'apps-config' }),
      providers: {
        Kulupu: 'wss://rpc.kulupu.corepaper.org/ws'
      }
    },
    {
      info: 'nodle',
      text: t('rpc.nodle-main', 'Nodle Main', { ns: 'apps-config' }),
      providers: {
        Nodle: 'wss://main1.nodleprotocol.io'
      }
    },
    {
      info: 'plasm',
      text: t('rpc.plasm', 'Plasm', { ns: 'apps-config' }),
      providers: {
        'Stake Technologies': 'wss://rpc.plasmnet.io/'
      }
    },
    {
      info: 'stafi',
      isDisabled: true, // Cannot find type ChainId
      text: t('rpc.stafi', 'Stafi', { ns: 'apps-config' }),
      providers: {
        'Stafi Foundation': 'wss://mainnet-rpc.stafi.io'
      }
    },
    {
      info: 'subsocial',
      text: t('rpc.subsocial', 'Subsocial', { ns: 'apps-config' }),
      providers: {
        DappForce: 'wss://rpc.subsocial.network'
      }
    }
  ]);
}
