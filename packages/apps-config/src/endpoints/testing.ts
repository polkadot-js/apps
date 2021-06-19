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

export function createTesting (t: TFunction, firstOnly?: boolean): LinkOption[] {
  return expandEndpoints(t, [
    // alphabetical based on chain name, e.g. Amber, Arcadia, Beresheet, ...
    {
      info: 'centrifuge',
      text: t('rpc.test.amber', 'Amber', { ns: 'apps-config' }),
      providers: {
        Centrifuge: { type: 'json-rpc' as EndpointType, param: 'wss://fullnode.amber.centrifuge.io' }
      }
    },
    {
      info: 'nodle',
      text: t('rpc.test.nodle-arcadia', 'Arcadia', { ns: 'apps-config' }),
      providers: {
        Nodle: { type: 'json-rpc' as EndpointType, param: 'wss://arcadia1.nodleprotocol.io' }
      }
    },
    {
      info: 'edgeware',
      text: t('rpc.test.beresheet', 'Beresheet', { ns: 'apps-config' }),
      providers: {
        'Commonwealth Labs': { type: 'json-rpc' as EndpointType, param: 'wss://beresheet1.edgewa.re' }
      }
    },
    {
      info: 'bifrost',
      isUnreachable: true, // https://github.com/polkadot-js/apps/issues/5619
      text: t('rpc.test.bifrost', 'Bifrost Asgard', { ns: 'apps-config' }),
      providers: {
        Bifrost: { type: 'json-rpc' as EndpointType, param: 'wss://bifrost-rpc.liebi.com/ws' }
      }
    },
    {
      info: 'bitcountry',
      text: t('rpc.test.bitcountry', 'Bit.Country Tewai', { ns: 'apps-config' }),
      providers: {
        'Bit.Country': { type: 'json-rpc' as EndpointType, param: 'wss://whenua.bit.country' }
      }
    },
    {
      info: 'canvas',
      text: t('rpc.test.canvas', 'Canvas', { ns: 'apps-config' }),
      providers: {
        Parity: { type: 'json-rpc' as EndpointType, param: 'wss://canvas-rpc.parity.io' }
      }
    },
    {
      info: 'clover',
      isDisabled: true, // Cannot construct unknown type BridgeNetworks
      text: t('rpc.test.clover.finance', 'Clover', { ns: 'apps-config' }),
      providers: {
        Clover: { type: 'json-rpc' as EndpointType, param: 'wss://api.clover.finance/' }
      }
    },
    {
      info: 'crust',
      text: t('rpc.test.crust.network', 'Crust Maxwell', { ns: 'apps-config' }),
      providers: {
        'Crust Network': { type: 'json-rpc' as EndpointType, param: 'wss://api.crust.network/' },
        'DCloud Foundation': { type: 'json-rpc' as EndpointType, param: 'wss://api.decloudf.com/' }
      }
    },
    {
      info: 'datahighway',
      isDisabled: true,
      text: t('rpc.test.datahighway.spreehafen', 'Spreehafen', { ns: 'apps-config' }),
      providers: {
        MXC: { type: 'json-rpc' as EndpointType, param: 'wss://spreehafen.datahighway.com' }
      }
    },
    {
      info: 'dock-testnet',
      isDisabled: false,
      text: t('rpc.test.dock-testnet', 'Dock', { ns: 'apps-config' }),
      providers: {
        'Dock Association': { type: 'json-rpc' as EndpointType, param: 'wss://danforth-1.dock.io' }
      }
    },
    {
      info: 'dotmog',
      text: t('rpc.test.dotmog', 'DOTMog', { ns: 'apps-config' }),
      providers: {
        DOTMog: { type: 'json-rpc' as EndpointType, param: 'wss://mogiway-01.dotmog.com' }
      }
    },
    {
      info: 'dusty',
      text: t('rpc.test.dusty', 'Dusty', { ns: 'apps-config' }),
      providers: {
        'Stake Technologies': { type: 'json-rpc' as EndpointType, param: 'wss://rpc.dusty.plasmnet.io/' }
      }
    },
    {
      info: 'encointer_cantillon',
      text: t('rpc.test.encointer.cantillon', 'Encointer Cantillon', { ns: 'apps-config' }),
      providers: {
        'Encointer Association': { type: 'json-rpc' as EndpointType, param: 'wss://cantillon.encointer.org' }
      }
    },
    {
      info: 'encointer_gesell',
      text: t('rpc.test.encointer.gesell', 'Encointer Gesell', { ns: 'apps-config' }),
      providers: {
        'Encointer Association': { type: 'json-rpc' as EndpointType, param: 'wss://gesell.encointer.org' }
      }
    },
    {
      info: 'equilibrium',
      text: t('rpc.test.equilibriumtestnet', 'Equilibrium', { ns: 'apps-config' }),
      providers: {
        Equilibrium: { type: 'json-rpc' as EndpointType, param: 'wss://testnet.equilibrium.io' }
      }
    },
    {
      info: 'substrate',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/5571
      text: t('rpc.test.flamingfir', 'Flaming Fir', { ns: 'apps-config' }),
      providers: {
        Parity: { type: 'json-rpc' as EndpointType, param: 'wss://substrate-rpc.parity.io' }
      }
    },
    {
      info: 'Galital',
      text: t('rpc.test.galital', 'Galital PC2', { ns: 'apps-config' }),
      providers: {
        StarkleyTech: { type: 'json-rpc' as EndpointType, param: 'wss://galital-rpc-testnet.starkleytech.com' }
      }
    },
    {
      info: 'galois',
      text: t('rpc.test.galois', 'Galois', { ns: 'apps-config' }),
      providers: {
        MathWallet: { type: 'json-rpc' as EndpointType, param: 'wss://galois-hk.maiziqianbao.net/ws' },
        'MathWallet Backup': { type: 'json-rpc' as EndpointType, param: 'wss://galois.maiziqianbao.net/ws' }
      }
    },
    {
      info: 'gamepower',
      text: t('rpc.test.gamepower', 'GamePower', { ns: 'apps-config' }),
      providers: {
        GamePower: { type: 'json-rpc' as EndpointType, param: 'wss://gamepower.io' }
      }
    },
    {
      info: 'geek',
      text: t('rpc.test.geek', 'GeekCash', { ns: 'apps-config' }),
      providers: {
        'Geek Team': { type: 'json-rpc' as EndpointType, param: 'wss://testnet.geekcash.org' }
      }
    },
    {
      info: 'halongbay',
      text: t('rpc.test.halongbay', 'Halongbay Testnet', { ns: 'apps-config' }),
      providers: {
        Halongbay: { type: 'json-rpc' as EndpointType, param: 'wss://halongbay.polkafoundry.com' }
      }
    },
    {
      info: 'ipse',
      text: t('rpc.test.ipse', 'IPSE', { ns: 'apps-config' }),
      providers: {
        'IPSE China': { type: 'json-rpc' as EndpointType, param: 'wss://testnet-china.ipse.io' },
        'IPSE USA': { type: 'json-rpc' as EndpointType, param: 'wss://testnet-usa.ipse.io' },
        'IPSE Europe': { type: 'json-rpc' as EndpointType, param: 'wss://testnet-europe.ipse.io' }
      }
    },
    {
      info: 'jupiter',
      text: t('rpc.test.jupiter', 'Jupiter', { ns: 'apps-config' }),
      providers: {
        Elara: { type: 'json-rpc' as EndpointType, param: 'wss://jupiter-poa.elara.patract.io' },
        Patract: { type: 'json-rpc' as EndpointType, param: 'wss://ws.jupiter-poa.patract.cn' }
      }
    },
    {
      info: 'kilt',
      text: t('rpc.test.kilt', 'KILT Mashnet', { ns: 'apps-config' }),
      providers: {
        'KILT Protocol': { type: 'json-rpc' as EndpointType, param: 'wss://full-nodes.kilt.io:9944/' }
      }
    },
    {
      info: 'klugdossier',
      text: t('rpc.KlugDossier', 'Klug Dossier', { ns: 'apps-config' }),
      providers: {
        'Klug Dossier': 'wss://klugdossier.net/'
      }
    },
    {
      info: 'kylin',
      text: t('testnet.kylin-node.co.uk', 'Kylin Testnet', { ns: 'apps-config' }),
      providers: {
        'Kylin Network': 'wss://testnet.kylin-node.co.uk'
      }
    },
    {
      info: 'litentry',
      text: t('rpc.test.litentry', 'Litentry Testnet', { ns: 'apps-config' }),
      providers: {
        Litentry: { type: 'json-rpc' as EndpointType, param: 'wss://testnet.litentry.io' }
      }
    },
    {
      info: 'acala',
      text: t('rpc.test.mandala', 'Mandala', { ns: 'apps-config' }),
      providers: {
        Acala: { type: 'json-rpc' as EndpointType, param: 'wss://acala-mandala.api.onfinality.io/public-ws' },
        'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://mandala.elara.patract.io' }
      }
    },
    {
      info: 'manta',
      text: t('rpc.manta', 'Manta Testnet', { ns: 'apps-config' }),
      providers: {
        'Manta Testnet': 'wss://ws.f1.testnet.manta.network'
      }
    },
    {
      info: 'moonbaseAlpha',
      text: t('rpc.test.moonbeam', 'Moonbase Alpha', { ns: 'apps-config' }),
      providers: {
        'Moonbeam Network': { type: 'json-rpc' as EndpointType, param: 'wss://wss.testnet.moonbeam.network' },
        OnFinality: { type: 'json-rpc' as EndpointType, param: 'wss://moonbeam-alpha.api.onfinality.io/public-ws' },
        'Patract Elara': { type: 'json-rpc' as EndpointType, param: 'wss://moonbase.moonbeam.elara.patract.io' }
      }
    },
    {
      info: 'mybank',
      text: t('rpc.test.mybank', 'mybank.network', { ns: 'apps-config' }),
      providers: {
        MYBANK: { type: 'json-rpc' as EndpointType, param: 'wss://mybank.network/substrate' }
      }
    },
    {
      info: 'nftmart',
      text: t('rpc.test.nftmart', 'NFTMart', { ns: 'apps-config' }),
      providers: {
        NFTMartDev: { type: 'json-rpc' as EndpointType, param: 'wss://dev-ws.nftmart.io' },
        NFTMartStaging: { type: 'json-rpc' as EndpointType, param: 'wss://staging-ws.nftmart.io' }
      }
    },
    {
      info: 'oak-testnet',
      text: t('rpc.test.oak', 'OAK Testnet', { ns: 'apps-config' }),
      providers: {
        'OAK Network': 'wss://rpc.testnet.oak.tech'
      }
    },
    {
      info: 'opportunity',
      text: t('rpc.test.opportunity', 'Opportunity', { ns: 'apps-config' }),
      providers: {
        Opportunity: 'wss://rpc.opportunity.standard.tech'
      }
    },
    {
      info: 'pangolin',
      text: t('rpc.test.pangolin', 'Pangolin', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': { type: 'json-rpc' as EndpointType, param: 'wss://pangolin-rpc.darwinia.network' }
      }
    },
    {
      info: 'phala',
      text: t('rpc.test.phala', 'Phala PoC-4', { ns: 'apps-config' }),
      providers: {
        'Phala Network': { type: 'json-rpc' as EndpointType, param: 'wss://poc4.phala.network/ws' }
      }
    },
    {
      info: 'phoenix',
      text: t('rpc.test.phoenix', 'Phoenix Mashnet', { ns: 'apps-config' }),
      providers: {
        'phoenix Protocol': { type: 'json-rpc' as EndpointType, param: 'wss://phoenix-ws.coinid.pro/' }
      }
    },
    {
      info: 'polkabtc',
      text: t('rpc.test.polkabtc', 'PolkaBTC', { ns: 'apps-config' }),
      providers: {
        Interlay: { type: 'json-rpc' as EndpointType, param: 'wss://beta.polkabtc.io/api/parachain' }
      }
    },
    {
      info: 'polkadex',
      text: t('rpc.test.polkadex', 'Polkadex', { ns: 'apps-config' }),
      providers: {
        'Polkadex Team': { type: 'json-rpc' as EndpointType, param: 'wss://blockchain.polkadex.trade' }
      }
    },
    {
      info: 'polymesh',
      text: t('rpc.test.polymesh', 'Polymesh ITN', { ns: 'apps-config' }),
      providers: {
        Polymath: { type: 'json-rpc' as EndpointType, param: 'wss://itn-rpc.polymesh.live' }
      }
    },
    {
      info: 'pontem',
      text: t('rpc.pontem', 'Pontem', { ns: 'apps-config' }),
      providers: {
        Pontem: 'wss://testnet.pontem.network/wss'
      }
    },
    {
      info: 'prism',
      text: t('rpc.test.prism', 'Prism', { ns: 'apps-config' }),
      providers: {
        Prism: { type: 'json-rpc' as EndpointType, param: 'wss://testnet.psm.link' }
      }
    },
    {
      info: 'realis',
      text: t('rpc.test.realis', 'Realis.Network', { ns: 'apps-config' }),
      providers: {
        'Realis.Network': { type: 'json-rpc' as EndpointType, param: 'wss://rpc.realis.network/' }
      }
    },
    {
      info: 'riochain',
      text: t('rpc.test.riochain', 'RioChain', { ns: 'apps-config' }),
      providers: {
        'RioChain Staging': { type: 'json-rpc' as EndpointType, param: 'wss://node.v1.staging.riochain.io' }
      }
    },
    {
      info: 'sora-substrate',
      text: t('rpc.test.sora-substrate-staging', 'SORA-staging', { ns: 'apps-config' }),
      providers: {
        Soramitsu: { type: 'json-rpc' as EndpointType, param: 'wss://ws.stage.sora2.soramitsu.co.jp' }
      }
    },
    {
      info: 'subgame',
      text: t('rpc.test.subgame', 'SubGame Staging', { ns: 'apps-config' }),
      providers: {
        SubGame: 'wss://staging.subgame.org'
      }
    },
    {
      info: 'ternoa-chaos',
      text: t('rpc.test.ternoa-chaos', 'Ternoa Chaos', { ns: 'apps-config' }),
      providers: {
        CapsuleCorp: { type: 'json-rpc' as EndpointType, param: 'wss://chaos.ternoa.com' }
      }
    },
    {
      info: 'laminar',
      text: t('rpc.test.turbulence', 'Turbulence', { ns: 'apps-config' }),
      providers: {
        Laminar: { type: 'json-rpc' as EndpointType, param: 'wss://testnet-node-1.laminar-chain.laminar.one/ws' }
      }
    },
    {
      info: 'uniarts',
      text: t('rpc.test.uniarts', 'UniArts', { ns: 'apps-config' }),
      providers: {
        UniArts: { type: 'json-rpc' as EndpointType, param: 'wss://testnet.uniarts.me' }
      }
    },
    {
      info: 'unique',
      text: t('rpc.test.unique', 'Unique', { ns: 'apps-config' }),
      providers: {
        Unique: { type: 'json-rpc' as EndpointType, param: 'wss://testnet2.uniquenetwork.io' }
      }
    },
    {
      info: 'unitv',
      text: t('rpc.test.unitv', 'Unit Network', { ns: 'apps-config' }),
      providers: {
        'Unit Network': { type: 'json-rpc' as EndpointType, param: 'wss://unitventures.io/' }
      }
    },
    {
      info: 'vodka',
      text: t('rpc.test.vodka', 'Vodka', { ns: 'apps-config' }),
      providers: {
        Vodka: { type: 'json-rpc' as EndpointType, param: 'wss://vodka.rpc.neatcoin.org/ws' }
      }
    },
    {
      info: 'web3games',
      isUnreachable: true, // https://github.com/polkadot-js/apps/runs/2755409009?check_suite_focus=true
      text: t('rpc.test.web3games', 'Web3Games', { ns: 'apps-config' }),
      providers: {
        Web3Games: { type: 'json-rpc' as EndpointType, param: 'wss://substrate.org.cn:4443' }
      }
    },
    {
      info: 'zeitgeist',
      text: t('rpc.test.zeitgeist', 'Zeitgeist Battery Park', { ns: 'apps-config' }),
      providers: {
        Zeitgeist: { type: 'json-rpc' as EndpointType, param: 'wss://bp-rpc.zeitgeist.pm' }
      }
    },
    {
      info: 'zero',
      text: t('rpc.test.zero', 'Zero', { ns: 'apps-config' }),
      providers: {
        ZERO: { type: 'json-rpc' as EndpointType, param: 'wss://alphaville.zero.io' }
      }
    }
  ], firstOnly);
}
