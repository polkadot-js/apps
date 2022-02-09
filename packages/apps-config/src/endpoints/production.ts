// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from './types';

import { expandEndpoints } from './util';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

// alphabetical based on chain name
export function createProduction (t: TFunction, firstOnly: boolean, withSort: boolean): LinkOption[] {
  return expandEndpoints(t, [
    {
      info: 'aleph',
      text: t('rpc.prod.aleph', 'Aleph Zero', { ns: 'apps-config' }),
      providers: {
        'Aleph Zero Foundation': 'wss://ws.azero.dev'
      }
    },
    {
      info: 'automata',
      text: t('rpc.prod.automata', 'Automata', { ns: 'apps-config' }),
      providers: {
        'Automata Network': 'wss://api.ata.network',
        OnFinality: 'wss://automata.api.onfinality.io/public-ws'
      }
    },
    {
      dnslink: 'centrifuge',
      info: 'centrifuge',
      text: t('rpc.prod.centrifuge', 'Centrifuge', { ns: 'apps-config' }),
      providers: {
        Centrifuge: 'wss://fullnode.centrifuge.io'
      }
    },
    {
      info: 'chainx',
      text: t('rpc.prod.chainx', 'ChainX', { ns: 'apps-config' }),
      providers: {
        ChainX: 'wss://mainnet.chainx.org/ws'
      }
    },
    {
      // this is also a duplicate as a parachain under Polkadot and Testing net -
      // it is either/or, not and
      info: 'coinversation',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6635
      text: t('rpc.prod.coinversation', 'Coinversation', { ns: 'apps-config' }),
      providers: {
        Coinversation: 'wss://rpc.coinversation.io/'
      }
    },
    {
      info: 'competitors-club',
      text: t('rpc.prod.competitors-club', 'Competitors Club', { ns: 'apps-config' }),
      providers: {
        'Competitors Club': 'wss://node0.competitors.club/wss'
      }
    },
    {
      info: 'crown-sterling',
      text: t('rpc.prod.crown-sterling', 'Crown Sterling', { ns: 'apps-config' }),
      providers: {
        'Crown Sterling': 'wss://blockchain.crownsterling.io'
      }
    },
    {
      info: 'crust',
      isDisabled: true, // https://github.com/polkadot-js/apps/pull/6761
      text: t('rpc.prod.crust', 'Crust Network', { ns: 'apps-config' }),
      providers: {
        'Crust Network': 'wss://rpc.crust.network'
      }
    },
    {
      info: 'darwinia',
      text: t('rpc.prod.darwinia', 'Darwinia', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': 'wss://rpc.darwinia.network'
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
      info: 'dock-pos-mainnet',
      text: t('rpc.prod.dock-pos-mainnet', 'Dock', { ns: 'apps-config' }),
      providers: {
        'Dock Association': 'wss://mainnet-node.dock.io'
      }
    },
    {
      dnslink: 'edgeware',
      info: 'edgeware',
      text: t('rpc.prod.edgeware', 'Edgeware', { ns: 'apps-config' }),
      providers: {
        'Commonwealth Labs': 'wss://mainnet.edgewa.re',
        OnFinality: 'wss://edgeware.api.onfinality.io/public-ws'
      }
    },
    {
      info: 'efinity',
      isDisabled: true, // https://github.com/polkadot-js/apps/pull/6761
      text: t('rpc.prod.efinity', 'Efinity', { ns: 'apps-config' }),
      providers: {
        Efinity: 'wss://rpc.efinity.io'
      }
    },
    {
      info: 'equilibrium',
      text: t('rpc.prod.equilibrium', 'Equilibrium', { ns: 'apps-config' }),
      providers: {
        Equilibrium: 'wss://node.equilibrium.io'
      }
    },
    {
      info: 'genshiro',
      text: t('rpc.prod.genshiro', 'Genshiro', { ns: 'apps-config' }),
      providers: {
        Equilibrium: 'wss://node.genshiro.io'
      }
    },
    {
      info: 'hanonycash',
      isDisabled: true, // https://github.com/polkadot-js/apps/runs/2755409009?check_suite_focus=true
      text: t('rpc.prod.hanonycash', 'Hanonycash', { ns: 'apps-config' }),
      providers: {
        Hanonycash: 'wss://rpc.hanonycash.com'
      }
    },
    {
      info: 'snakenet',
      text: t('rpc.prod.hydra', 'HydraDX', { ns: 'apps-config' }),
      providers: {
        HydraDX: 'wss://rpc-01.snakenet.hydradx.io',
        'Galactic Council': 'wss://rpc-02.snakenet.hydradx.io',
        Archives: 'wss://archive.snakenet.hydradx.io'
      }
    },
    {
      info: 'integritee',
      text: t('rpc.prod.integritee', 'Integritee Network', { ns: 'apps-config' }),
      providers: {
        Integritee: 'wss://api.solo.integritee.io'
      }
    },
    {
      dnslink: 'kulupu',
      info: 'kulupu',
      text: t('rpc.prod.kulupu', 'Kulupu', { ns: 'apps-config' }),
      providers: {
        Kulupu: 'wss://rpc.kulupu.corepaper.org/ws'
      }
    },
    {
      info: 'kusari',
      text: t('rpc.prod.kusari', 'Kusari', { ns: 'apps-config' }),
      providers: {
        Swapdex: 'wss://ws.kusari.network'
      }
    },
    {
      info: 'mathchain',
      text: t('rpc.prod.mathchain', 'MathChain', { ns: 'apps-config' }),
      providers: {
        MathWallet: 'wss://mathchain-asia.maiziqianbao.net/ws',
        'MathWallet Backup': 'wss://mathchain-us.maiziqianbao.net/ws'
      }
    },
    {
      info: 'neatcoin',
      text: t('rpc.prod.neatcoin', 'Neatcoin', { ns: 'apps-config' }),
      providers: {
        Neatcoin: 'wss://rpc.neatcoin.org/ws'
      }
    },
    {
      info: 'nftmart',
      text: t('rpc.prod.nftmart', 'NFTMart', { ns: 'apps-config' }),
      providers: {
        NFTMart: 'wss://mainnet.nftmart.io/rpc/ws'
      }
    },
    {
      info: 'nodle',
      text: t('rpc.prod.nodle-main', 'Nodle', { ns: 'apps-config' }),
      providers: {
        Nodle: 'wss://main3.nodleprotocol.io',
        OnFinality: 'wss://nodle.api.onfinality.io/public-ws'
        // Pinknode: 'wss://rpc.pinknode.io/nodle/explorer' // https://github.com/polkadot-js/apps/issues/5721
      }
    },
    {
      info: 'plasm',
      text: t('rpc.prod.plasm', 'Plasm', { ns: 'apps-config' }),
      providers: {
        'Stake Technologies': 'wss://rpc.plasmnet.io/'
      }
    },
    {
      info: 'polkadex',
      text: t('rpc.prod.polkadex', 'Polkadex', { ns: 'apps-config' }),
      providers: {
        'Polkadex Team': 'wss://mainnet.polkadex.trade'
      }
    },
    {
      info: 'polymesh',
      text: t('rpc.prod.polymesh', 'Polymesh Mainnet', { ns: 'apps-config' }),
      providers: {
        Polymath: 'wss://mainnet-rpc.polymesh.network'
      }
    },
    {
      info: 'riochain',
      text: t('rpc.prod.riochain', 'RioChain', { ns: 'apps-config' }),
      providers: {
        RioChain: 'wss://node.v1.riochain.io'
      }
    },
    {
      info: 'robonomics',
      isDisabled: true, // https://github.com/polkadot-js/apps/pull/6761
      text: t('rpc.prod.robonomics', 'Robonomics', { ns: 'apps-config' }),
      providers: {
        Airalab: 'wss://kusama.rpc.robonomics.network/'
      }
    },
    {
      info: 'sherpax',
      text: t('rpc.prod.sherpax', 'SherpaX', { ns: 'apps-config' }),
      providers: {
        ChainX: 'wss://mainnet.sherpax.io'
      }
    },
    {
      info: 'sora-substrate',
      text: t('rpc.prod.sora-substrate', 'SORA', { ns: 'apps-config' }),
      providers: {
        'SORA Parliament Ministry of Finance #2': 'wss://mof2.sora.org',
        'SORA Parliament Ministry of Finance': 'wss://ws.mof.sora.org',
        'SORA Parliament Ministry of Finance #3': 'wss://mof3.sora.org',
        Soramitsu: 'wss://ws.alb.sora.org',
        OnFinality: 'wss://sora.api.onfinality.io/public-ws'
        // 'SORA Community (Lux8)': 'wss://sora.lux8.net' // https://github.com/polkadot-js/apps/issues/6195
      }
    },
    {
      info: 'spanner',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6547
      text: t('rpc.spanner', 'Spanner', { ns: 'apps-config' }),
      providers: {
        Spanner: 'wss://wss.spannerprotocol.com'
      }
    },
    {
      info: 'stafi',
      isDisabled: true, // Cannot find type ChainId
      text: t('rpc.prod.stafi', 'Stafi', { ns: 'apps-config' }),
      providers: {
        'Stafi Foundation': 'wss://mainnet-rpc.stafi.io'
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
        DappForce: 'wss://rpc.subsocial.network'
      }
    },
    {
      info: 'uniarts',
      text: t('rpc.prod.uniarts', 'UniArts', { ns: 'apps-config' }),
      providers: {
        UniArts: 'wss://mainnet.uniarts.vip:9443'
      }
    },
    {
      info: 'westlake',
      text: t('rpc.prod.westlake', 'Westlake', { ns: 'apps-config' }),
      providers: {
        DataHighway: 'wss://westlake.datahighway.com'
      }
    }
  ], firstOnly, withSort);
}
