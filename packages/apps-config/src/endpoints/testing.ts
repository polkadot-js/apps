// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

import { EndpointType } from './types';
import { expandEndpoints } from './util';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

export function createTesting (t: TFunction): LinkOption[] {
  return expandEndpoints(t, [
    // alphabetical based on chain name, e.g. Amber, Arcadia, Beresheet, ...
    {
      info: 'centrifuge',
      text: t('rpc.test.amber', 'Amber', { ns: 'apps-config' }),
      providers: {
        Centrifuge: { type: EndpointType.jrpc, url: 'wss://fullnode.amber.centrifuge.io' }
      }
    },
    {
      info: 'nodle',
      text: t('rpc.test.nodle-arcadia', 'Arcadia', { ns: 'apps-config' }),
      providers: {
        Nodle: { type: EndpointType.jrpc, url: 'wss://arcadia1.nodleprotocol.io' }
      }
    },
    {
      info: 'edgeware',
      text: t('rpc.test.beresheet', 'Beresheet', { ns: 'apps-config' }),
      providers: {
        'Commonwealth Labs': { type: EndpointType.jrpc, url: 'wss://beresheet1.edgewa.re' }
      }
    },
    {
      info: 'bitcountry',
      text: t('rpc.test.bitcountry', 'Bit.Country Tewai', { ns: 'apps-config' }),
      providers: {
        'Bit.Country': { type: EndpointType.jrpc, url: 'wss://whenua.bit.country' }
      }
    },
    {
      info: 'bifrost',
      text: t('rpc.test.bifrost', 'Bifrost Asgard', { ns: 'apps-config' }),
      providers: {
        Bifrost: { type: EndpointType.jrpc, url: 'wss://testnet.liebi.com' }
      }
    },
    {
      info: 'canvas',
      text: t('rpc.test.canvas', 'Canvas', { ns: 'apps-config' }),
      providers: {
        Parity: { type: EndpointType.jrpc, url: 'wss://canvas-rpc.parity.io' }
      }
    },
    {
      info: 'clover',
      isDisabled: true, // Cannot construct unknown type BridgeNetworks
      text: t('rpc.test.clover.finance', 'Clover', { ns: 'apps-config' }),
      providers: {
        Clover: { type: EndpointType.jrpc, url: 'wss://api.clover.finance/' }
      }
    },
    {
      info: 'crust',
      text: t('rpc.test.crust.network', 'Crust Maxwell', { ns: 'apps-config' }),
      providers: {
        'Crust Network': { type: EndpointType.jrpc, url: 'wss://api.crust.network/' },
        'DCloud Foundation': { type: EndpointType.jrpc, url: 'wss://api.decloudf.com/' }
      }
    },
    {
      info: 'datahighway',
      isDisabled: true,
      text: t('rpc.test.datahighway.spreehafen', 'Spreehafen', { ns: 'apps-config' }),
      providers: {
        MXC: { type: EndpointType.jrpc, url: 'wss://spreehafen.datahighway.com' }
      }
    },
    {
      info: 'dock-testnet',
      text: t('rpc.test.dock-testnet', 'Dock', { ns: 'apps-config' }),
      providers: {
        'Dock Association': { type: EndpointType.jrpc, url: 'wss://danforth-1.dock.io' }
      }
    },
    {
      info: 'dotmog',
      text: t('rpc.test.dotmog', 'DOTMog', { ns: 'apps-config' }),
      providers: {
        DOTMog: { type: EndpointType.jrpc, url: 'wss://mogiway-01.dotmog.com' }
      }
    },
    {
      info: 'dusty',
      text: t('rpc.test.dusty', 'Dusty', { ns: 'apps-config' }),
      providers: {
        'Stake Technologies': { type: EndpointType.jrpc, url: 'wss://rpc.dusty.plasmnet.io/' }
      }
    },
    {
      info: 'encointer_cantillon',
      text: t('rpc.test.encointer.cantillon', 'Encointer Cantillon', { ns: 'apps-config' }),
      providers: {
        'Encointer Association': { type: EndpointType.jrpc, url: 'wss://cantillon.encointer.org' }
      }
    },
    {
      info: 'encointer_gesell',
      text: t('rpc.test.encointer.gesell', 'Encointer Gesell', { ns: 'apps-config' }),
      providers: {
        'Encointer Association': { type: EndpointType.jrpc, url: 'wss://gesell.encointer.org' }
      }
    },
    {
      info: 'equilibrium',
      text: t('rpc.test.equilibriumtestnet', 'Equilibrium', { ns: 'apps-config' }),
      providers: {
        Equilibrium: { type: EndpointType.jrpc, url: 'wss://testnet.equilibrium.io' }
      }
    },
    {
      info: 'substrate',
      text: t('rpc.test.flamingfir', 'Flaming Fir', { ns: 'apps-config' }),
      providers: {
        Parity: { type: EndpointType.jrpc, url: 'wss://substrate-rpc.parity.io' }
      }
    },
    {
      info: 'Galital',
      text: t('rpc.test.galital', 'Galital PC2', { ns: 'apps-config' }),
      providers: {
        StarkleyTech: { type: EndpointType.jrpc, url: 'wss://galital-rpc-testnet.starkleytech.com' }
      }
    },
    {
      info: 'galois',
      text: t('rpc.test.galois', 'Galois', { ns: 'apps-config' }),
      providers: {
        MathWallet: { type: EndpointType.jrpc, url: 'wss://galois-hk.maiziqianbao.net/ws' },
        'MathWallet Backup': { type: EndpointType.jrpc, url: 'wss://galois.maiziqianbao.net/ws' }
      }
    },
    {
      info: 'gamepower',
      text: t('rpc.test.gamepower', 'GamePower', { ns: 'apps-config' }),
      providers: {
        GamePower: { type: EndpointType.jrpc, url: 'wss://gamepower.io' }
      }
    },
    {
      info: 'geek',
      text: t('rpc.test.geek', 'GeekCash', { ns: 'apps-config' }),
      providers: {
        'Geek Team': { type: EndpointType.jrpc, url: 'wss://testnet.geekcash.org' }
      }
    },
    {
      info: 'halongbay',
      text: t('rpc.test.halongbay', 'Halongbay Testnet', { ns: 'apps-config' }),
      providers: {
        Halongbay: { type: EndpointType.jrpc, url: 'wss://halongbay.polkafoundry.com' }
      }
    },
    {
      info: 'ipse',
      text: t('rpc.test.ipse', 'IPSE', { ns: 'apps-config' }),
      providers: {
        'IPSE China': { type: EndpointType.jrpc, url: 'wss://testnet-china.ipse.io' },
        'IPSE USA': { type: EndpointType.jrpc, url: 'wss://testnet-usa.ipse.io' },
        'IPSE Europe': { type: EndpointType.jrpc, url: 'wss://testnet-europe.ipse.io' }
      }
    },
    {
      info: 'jupiter',
      text: t('rpc.test.jupiter', 'Jupiter', { ns: 'apps-config' }),
      providers: {
        Elara: { type: EndpointType.jrpc, url: 'wss://jupiter-poa.elara.patract.io' },
        Patract: { type: EndpointType.jrpc, url: 'wss://ws.jupiter-poa.patract.cn' }
      }
    },
    {
      info: 'kilt',
      text: t('rpc.test.kilt', 'KILT Mashnet', { ns: 'apps-config' }),
      providers: {
        'KILT Protocol': { type: EndpointType.jrpc, url: 'wss://full-nodes.kilt.io:9944/' }
      }
    },
    {
      info: 'litentry',
      text: t('rpc.test.litentry', 'Litentry Testnet', { ns: 'apps-config' }),
      providers: {
        Litentry: { type: EndpointType.jrpc, url: 'wss://testnet.litentry.io' }
      }
    },
    {
      info: 'acala',
      text: t('rpc.test.mandala', 'Mandala', { ns: 'apps-config' }),
      providers: {
        Acala: { type: EndpointType.jrpc, url: 'wss://acala-mandala.api.onfinality.io/public-ws' },
        'Patract Elara': { type: EndpointType.jrpc, url: 'wss://mandala.elara.patract.io' }
      }
    },
    {
      info: 'moonbaseAlpha',
      text: t('rpc.test.moonbeam', 'Moonbase Alpha', { ns: 'apps-config' }),
      providers: {
        'Moonbeam Network': { type: EndpointType.jrpc, url: 'wss://wss.testnet.moonbeam.network' },
        OnFinality: { type: EndpointType.jrpc, url: 'wss://moonbeam-alpha.api.onfinality.io/public-ws' },
        'Patract Elara': { type: EndpointType.jrpc, url: 'wss://moonbase.moonbeam.elara.patract.io' }
      }
    },
    {
      info: 'mybank',
      text: t('rpc.test.mybank', 'mybank.network', { ns: 'apps-config' }),
      providers: {
        MYBANK: { type: EndpointType.jrpc, url: 'wss://mybank.network/substrate' }
      }
    },
    {
      info: 'nftmart',
      text: t('rpc.test.nftmart', 'NFTMart', { ns: 'apps-config' }),
      providers: {
        NFTMartDev: { type: EndpointType.jrpc, url: 'wss://dev-ws.nftmart.io' },
        NFTMartStaging: { type: EndpointType.jrpc, url: 'wss://staging-ws.nftmart.io' }
      }
    },
    {
      info: 'pangolin',
      text: t('rpc.test.pangolin', 'Pangolin', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': { type: EndpointType.jrpc, url: 'wss://pangolin-rpc.darwinia.network' }
      }
    },
    {
      info: 'phala',
      text: t('rpc.test.phala', 'Phala PoC-4', { ns: 'apps-config' }),
      providers: {
        'Phala Network': { type: EndpointType.jrpc, url: 'wss://poc4.phala.network/ws' }
      }
    },
    {
      info: 'phoenix',
      text: t('rpc.test.phoenix', 'Phoenix Mashnet', { ns: 'apps-config' }),
      providers: {
        'phoenix Protocol': { type: EndpointType.jrpc, url: 'wss://phoenix-ws.coinid.pro/' }
      }
    },
    {
      info: 'polkadex',
      text: t('rpc.test.polkadex', 'Polkadex', { ns: 'apps-config' }),
      providers: {
        'Polkadex Team': { type: EndpointType.jrpc, url: 'wss://blockchain.polkadex.trade' }
      }
    },
    {
      info: 'polkabtc',
      text: t('rpc.test.polkabtc', 'PolkaBTC', { ns: 'apps-config' }),
      providers: {
        Interlay: { type: EndpointType.jrpc, url: 'wss://beta.polkabtc.io/api/parachain' }
      }
    },
    {
      info: 'polymesh',
      text: t('rpc.test.polymesh', 'Polymesh ITN', { ns: 'apps-config' }),
      providers: {
        Polymath: { type: EndpointType.jrpc, url: 'wss://itn-rpc.polymesh.live' }
      }
    },
    {
      info: 'prism',
      text: t('rpc.test.prism', 'Prism', { ns: 'apps-config' }),
      providers: {
        Prism: { type: EndpointType.jrpc, url: 'wss://testnet.psm.link' }
      }
    },
    {
      info: 'realis',
      text: t('rpc.test.realis', 'Realis.Network', { ns: 'apps-config' }),
      providers: {
        'Realis.Network': { type: EndpointType.jrpc, url: 'wss://rpc.realis.network/' }
      }
    },
    {
      info: 'riochain',
      text: t('rpc.test.riochain', 'RioChain', { ns: 'apps-config' }),
      providers: {
        'RioChain Staging': { type: EndpointType.jrpc, url: 'wss://node.v1.staging.riochain.io' }
      }
    },
    {
      info: 'sora-substrate',
      text: t('rpc.test.sora-substrate-staging', 'SORA-staging', { ns: 'apps-config' }),
      providers: {
        Soramitsu: { type: EndpointType.jrpc, url: 'wss://ws.stage.sora2.soramitsu.co.jp' }
      }
    },
    {
      info: 'ternoa-chaos',
      text: t('rpc.test.ternoa-chaos', 'Ternoa Chaos', { ns: 'apps-config' }),
      providers: {
        CapsuleCorp: { type: EndpointType.jrpc, url: 'wss://chaos.ternoa.com' }
      }
    },
    {
      info: 'laminar',
      text: t('rpc.test.turbulence', 'Turbulence', { ns: 'apps-config' }),
      providers: {
        Laminar: { type: EndpointType.jrpc, url: 'wss://testnet-node-1.laminar-chain.laminar.one/ws' }
      }
    },
    {
      info: 'uniarts',
      text: t('rpc.test.uniarts', 'UniArts', { ns: 'apps-config' }),
      providers: {
        UniArts: { type: EndpointType.jrpc, url: 'wss://testnet.uniarts.me' }
      }
    },
    {
      info: 'unique',
      text: t('rpc.test.unique', 'Unique', { ns: 'apps-config' }),
      providers: {
        Unique: { type: EndpointType.jrpc, url: 'wss://testnet2.uniquenetwork.io' }
      }
    },
    {
      info: 'unitv',
      text: t('rpc.test.unitv', 'Unit Network', { ns: 'apps-config' }),
      providers: {
        'Unit Network': { type: EndpointType.jrpc, url: 'wss://unitventures.io/' }
      }
    },
    {
      info: 'vodka',
      text: t('rpc.test.vodka', 'Vodka', { ns: 'apps-config' }),
      providers: {
        Vodka: { type: EndpointType.jrpc, url: 'wss://vodka.rpc.neatcoin.org/ws' }
      }
    },
    {
      info: 'web3games',
      text: t('rpc.test.web3games', 'Web3Games', { ns: 'apps-config' }),
      providers: {
        Web3Games: { type: EndpointType.jrpc, url: 'wss://substrate.org.cn:4443' }
      }
    },
    {
      info: 'zeitgeist',
      text: t('rpc.test.zeitgeist', 'Zeitgeist Battery Park', { ns: 'apps-config' }),
      providers: {
        Zeitgeist: { type: EndpointType.jrpc, url: 'wss://bp-rpc.zeitgeist.pm' }
      }
    },
    {
      info: 'zero',
      text: t('rpc.test.zero', 'Zero', { ns: 'apps-config' }),
      providers: {
        ZERO: { type: EndpointType.jrpc, url: 'wss://alphaville.zero.io' }
      }
    }
  ]);
}
