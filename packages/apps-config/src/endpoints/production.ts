// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from './types';

import { EndpointType } from '../../../../../ui/packages/ui-settings/src/types';
import { expandEndpoints } from './util';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

// alphabetical based on chain name
export function createProduction (t: TFunction, firstOnly?: boolean): LinkOption[] {
  return expandEndpoints(t, [
    {
      dnslink: 'centrifuge',
      info: 'centrifuge',
      text: t('rpc.prod.centrifuge', 'Centrifuge', { ns: 'apps-config' }),
      providers: {
        Centrifuge: { type: 'json-rpc' as EndpointType, param: 'wss://fullnode.centrifuge.io' }
      }
    },
    {
      info: 'chainx',
      text: t('rpc.prod.chainx', 'ChainX', { ns: 'apps-config' }),
      providers: {
        // ChainX: { type: 'json-rpc' as EndpointType, param: 'wss://mainnet.chainx.org/ws' }, // https://github.com/polkadot-js/apps/issues/5547
        'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://chainx.elara.patract.io' }
    },
    {
      info: 'darwinia',
      text: t('rpc.prod.darwinia', 'Darwinia', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': { type: 'json-rpc' as EndpointType, param: 'wss://rpc.darwinia.network' },
        'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://darwinia.elara.patract.io' }
      }
    },
    {
      info: 'crab',
      text: t('rpc.prod.crab', 'Darwinia Crab', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': 'wss://crab-rpc.darwinia.network'
      }
    },
    {
      info: 'dock-mainnet',
      text: t('rpc.prod.dock-mainnet', 'Dock', { ns: 'apps-config' }),
      providers: {
        'Dock Association': { type: 'json-rpc' as EndpointType, param: 'wss://mainnet-node.dock.io' },
        'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://dock.elara.patract.io' }
      }
    },
    {
      dnslink: 'edgeware',
      info: 'edgeware',
      text: t('rpc.prod.edgeware', 'Edgeware', { ns: 'apps-config' }),
      providers: {
        'Commonwealth Labs': { type: 'json-rpc' as EndpointType, param: 'wss://mainnet1.edgewa.re' },
        'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://edgeware.elara.patract.io' },
        OnFinality: { type: 'json-rpc' as EndpointType, param: 'wss://edgeware.api.onfinality.io/public-ws' }
      }
    },
    {
      info: 'equilibrium',
      text: t('rpc.prod.equilibrium', 'Equilibrium', { ns: 'apps-config' }),
      providers: {
        Equilibrium: { type: 'json-rpc' as EndpointType, param: 'wss://node.equilibrium.io' }
      }
    },
    {
      info: 'hanonycash',
      isUnreachable: true, // https://github.com/polkadot-js/apps/runs/2755409009?check_suite_focus=true
      text: t('rpc.prod.hanonycash', 'Hanonycash', { ns: 'apps-config' }),
      providers: {
        Hanonycash: { type: 'json-rpc' as EndpointType, param: 'wss://rpc.hanonycash.com' }
      }
    },
    {
      info: 'snakenet',
      text: t('rpc.prod.hydra', 'HydraDX', { ns: 'apps-config' }),
      providers: {
        HydraDX: { type: 'json-rpc' as EndpointType, param: 'wss://rpc-01.snakenet.hydradx.io' },
        'Galactic Council': { type: 'json-rpc' as EndpointType, param: 'wss://rpc-02.snakenet.hydradx.io' },
        Archives: { type: 'json-rpc' as EndpointType, param: 'wss://archive.snakenet.hydradx.io' }
      }
    },
    {
      dnslink: 'kulupu',
      info: 'kulupu',
      text: t('rpc.prod.kulupu', 'Kulupu', { ns: 'apps-config' }),
      providers: {
        Kulupu: { type: 'json-rpc' as EndpointType, param: 'wss://rpc.kulupu.corepaper.org/ws' },
        'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://kulupu.elara.patract.io' }
      }
    },
    {
      info: 'neatcoin',
      text: t('rpc.prod.neatcoin', 'Neatcoin', { ns: 'apps-config' }),
      providers: {
        Neatcoin: { type: 'json-rpc' as EndpointType, param: 'wss://rpc.neatcoin.org/ws' }
      }
    },
    {
      info: 'nodle',
      text: t('rpc.prod.nodle-main', 'Nodle', { ns: 'apps-config' }),
      providers: {
        Nodle: { type: 'json-rpc' as EndpointType, param: 'wss://main3.nodleprotocol.io' },
        'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://nodle.elara.patract.io' }
      }
    },
    {
      info: 'plasm',
      text: t('rpc.prod.plasm', 'Plasm', { ns: 'apps-config' }),
      providers: {
        'Stake Technologies': { type: 'json-rpc' as EndpointType, param: 'wss://rpc.plasmnet.io/' },
        'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://plasm.elara.patract.io' }
      }
    },
    {
      info: 'riochain',
      text: t('rpc.prod.riochain', 'RioChain', { ns: 'apps-config' }),
      providers: {
        RioChain: { type: 'json-rpc' as EndpointType, param: 'wss://node.v1.riochain.io' }
      }
    },
    {
      info: 'sora-substrate',
      text: t('rpc.prod.sora-substrate', 'SORA', { ns: 'apps-config' }),
      providers: {
        Soramitsu: { type: 'json-rpc' as EndpointType, param: 'wss://ws.sora2.soramitsu.co.jp' },
        'SORA Parliament Ministry of Finance': { type: 'json-rpc' as EndpointType, param: 'wss://ws.mof.sora.org:4443' }
      }
    },
    {
      info: 'stafi',
      isDisabled: true, // Cannot find type ChainId
      text: t('rpc.prod.stafi', 'Stafi', { ns: 'apps-config' }),
      providers: {
        'Stafi Foundation': { type: 'json-rpc' as EndpointType, param: 'wss://mainnet-rpc.stafi.io' },
        'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://stafi.elara.patract.io' }
      }
    },
    {
      info: 'subgame',
      text: t('rpc.prod.subgame', 'SubGame', { ns: 'apps-config' }),
      providers: {
        SubGame: 'wss://mainnet.subgame.org/'
      }
    },
    {
      info: 'subsocial',
      text: t('rpc.prod.subsocial', 'Subsocial', { ns: 'apps-config' }),
      providers: {
        DappForce: { type: 'json-rpc' as EndpointType, param: 'wss://rpc.subsocial.network' },
        'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://subsocial.elara.patract.io' }
      }
    },
    {
      info: 'uniarts',
      text: t('rpc.prod.uniarts', 'UniArts', { ns: 'apps-config' }),
      providers: {
        UniArts: { type: 'json-rpc' as EndpointType, param: 'wss://mainnet.uniarts.vip:9443' }
      }
    },
    {
      info: 'westlake',
      text: t('rpc.prod.westlake', 'Westlake', { ns: 'apps-config' }),
      providers: {
        DataHighway: { type: 'json-rpc' as EndpointType, param: 'wss://westlake.datahighway.com' }
      }
    }
  ], firstOnly);
}
