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
        'Darwinia Network': 'wss://crab-rpc.darwinia.network'
      }
    },
    {
      info: 'chainx',
      text: t('rpc.chainx', 'ChainX', { ns: 'apps-config' }),
      providers: {
        ChainX: 'wss://mainnet.chainx.org/ws',
        'Patract Elara': 'wss://chainx.elara.patract.io'
      }
    },
    {
      info: 'darwinia',
      text: t('rpc.darwinia', 'Darwinia', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': 'wss://rpc.darwinia.network',
        'Patract Elara': 'wss://darwinia.elara.patract.io'
      }
    },
    {
      info: 'dock-mainnet',
      text: t('rpc.dock-mainnet', 'Dock', { ns: 'apps-config' }),
      providers: {
        'Dock Association': 'wss://mainnet-node.dock.io',
        'Patract Elara': 'wss://dock.elara.patract.io'
      }
    },
    {
      dnslink: 'edgeware',
      info: 'edgeware',
      text: t('rpc.edgeware', 'Edgeware', { ns: 'apps-config' }),
      providers: {
        'Commonwealth Labs': 'wss://mainnet1.edgewa.re',
        'Patract Elara': 'wss://edgeware.elara.patract.io'
      }
    },
    {
      info: 'equilibrium',
      text: t('rpc.equilibrium', 'Equilibrium', { ns: 'apps-config' }),
      providers: {
        Equilibrium: 'wss://node.equilibrium.io'
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
      info: 'snakenet',
      text: t('rpc.hydra', 'HydraDX', { ns: 'apps-config' }),
      providers: {
        HydraDX: 'wss://rpc-01.snakenet.hydradx.io',
        'Galactic Council': 'wss://rpc-02.snakenet.hydradx.io'
      }
    },
    {
      dnslink: 'kulupu',
      info: 'kulupu',
      text: t('rpc.kulupu', 'Kulupu', { ns: 'apps-config' }),
      providers: {
        Kulupu: 'wss://rpc.kulupu.corepaper.org/ws',
        'Patract Elara': 'wss://kulupu.elara.patract.io'
      }
    },
    {
      info: 'nodle',
      text: t('rpc.nodle-main', 'Nodle', { ns: 'apps-config' }),
      providers: {
        Nodle: 'wss://main3.nodleprotocol.io',
        'Patract Elara': 'wss://nodle.elara.patract.io'
      }
    },
    {
      info: 'plasm',
      text: t('rpc.plasm', 'Plasm', { ns: 'apps-config' }),
      providers: {
        'Stake Technologies': 'wss://rpc.plasmnet.io/',
        'Patract Elara': 'wss://plasm.elara.patract.io'
      }
    },
    {
      info: 'stafi',
      isDisabled: true, // Cannot find type ChainId
      text: t('rpc.stafi', 'Stafi', { ns: 'apps-config' }),
      providers: {
        'Stafi Foundation': 'wss://mainnet-rpc.stafi.io',
        'Patract Elara': 'wss://stafi.elara.patract.io'
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
