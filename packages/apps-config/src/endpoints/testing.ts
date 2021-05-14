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

export function createTesting (t: TFunction): LinkOption[] {
  return expandEndpoints(t, [
    // alphabetical based on chain name, e.g. Amber, Arcadia, Beresheet, ...
    {
      info: 'centrifuge',
      text: t('rpc.amber', 'Amber', { ns: 'apps-config' }),
      providers: {
        Centrifuge: 'wss://fullnode.amber.centrifuge.io'
      }
    },
    {
      info: 'nodle',
      text: t('rpc.nodle-arcadia', 'Arcadia', { ns: 'apps-config' }),
      providers: {
        Nodle: 'wss://arcadia1.nodleprotocol.io'
      }
    },
    {
      info: 'edgeware',
      text: t('rpc.beresheet', 'Beresheet', { ns: 'apps-config' }),
      providers: {
        'Commonwealth Labs': 'wss://beresheet1.edgewa.re'
      }
    },
    {
      info: 'bitcountry',
      text: t('rpc.bitcountry', 'Bit.Country Tewai', { ns: 'apps-config' }),
      providers: {
        'Bit.Country': 'wss://whenua.bit.country'
      }
    },
    {
      info: 'bifrost',
      text: t('rpc.bifrost', 'Bifrost Asgard', { ns: 'apps-config' }),
      providers: {
        Bifrost: 'wss://testnet.liebi.com'
      }
    },
    {
      info: 'canvas',
      text: t('rpc.canvas', 'Canvas', { ns: 'apps-config' }),
      providers: {
        Parity: 'wss://canvas-rpc.parity.io'
      }
    },
    {
      info: 'clover',
      isDisabled: true, // Cannot construct unknown type BridgeNetworks
      text: t('rpc.clover.finance', 'Clover', { ns: 'apps-config' }),
      providers: {
        Clover: 'wss://api.clover.finance/'
      }
    },
    {
      info: 'crust',
      text: t('rpc.crust.network', 'Crust Maxwell', { ns: 'apps-config' }),
      providers: {
        'Crust Network': 'wss://api.crust.network/',
        'DCloud Foundation': 'wss://api.decloudf.com/'
      }
    },
    {
      info: 'datahighway',
      isDisabled: true,
      text: t('rpc.datahighway.spreehafen', 'Spreehafen', { ns: 'apps-config' }),
      providers: {
        MXC: 'wss://spreehafen.datahighway.com'
      }
    },
    {
      info: 'dock-testnet',
      text: t('rpc.dock-testnet', 'Dock', { ns: 'apps-config' }),
      providers: {
        'Dock Association': 'wss://danforth-1.dock.io'
      }
    },
    {
      info: 'dotmog',
      text: t('rpc.dotmog', 'DOTMog', { ns: 'apps-config' }),
      providers: {
        DOTMog: 'wss://mogiway-01.dotmog.com'
      }
    },
    {
      info: 'dusty',
      text: t('rpc.dusty', 'Dusty', { ns: 'apps-config' }),
      providers: {
        'Stake Technologies': 'wss://rpc.dusty.plasmnet.io/'
      }
    },
    {
      info: 'encointer_cantillon',
      text: t('rpc.encointer.cantillon', 'Encointer Cantillon', { ns: 'apps-config' }),
      providers: {
        'Encointer Association': 'wss://cantillon.encointer.org'
      }
    },
    {
      info: 'encointer_gesell',
      text: t('rpc.encointer.gesell', 'Encointer Gesell', { ns: 'apps-config' }),
      providers: {
        'Encointer Association': 'wss://gesell.encointer.org'
      }
    },
    {
      info: 'equilibrium',
      text: t('rpc.equilibriumtestnet', 'Equilibrium', { ns: 'apps-config' }),
      providers: {
        Equilibrium: 'wss://testnet.equilibrium.io'
      }
    },
    {
      info: 'substrate',
      text: t('rpc.flamingfir', 'Flaming Fir', { ns: 'apps-config' }),
      providers: {
        Parity: 'wss://substrate-rpc.parity.io'
      }
    },
    {
      info: 'Galital',
      text: t('rpc.galital', 'Galital PC2', { ns: 'apps-config' }),
      providers: {
        StarkleyTech: 'wss://galital-rpc-testnet.starkleytech.com'
      }
    },
    {
      info: 'galois',
      text: t('rpc.galois', 'Galois', { ns: 'apps-config' }),
      providers: {
        MathWallet: 'wss://galois-hk.maiziqianbao.net/ws',
        'MathWallet Backup': 'wss://galois.maiziqianbao.net/ws'
      }
    },
    {
      info: 'gamepower',
      text: t('rpc.gamepower', 'GamePower', { ns: 'apps-config' }),
      providers: {
        GamePower: 'wss://gamepower.io'
      }
    },
    {
      info: 'geek',
      text: t('rpc.geek', 'GeekCash', { ns: 'apps-config' }),
      providers: {
        'Geek Team': 'wss://testnet.geekcash.org'
      }
    },
    {
      info: 'halongbay',
      text: 'Halongbay Testnet',
      providers: {
        Halongbay: 'wss://halongbay.polkafoundry.com'
      }
    },
    {
      info: 'ipse',
      text: t('rpc.ipse', 'IPSE', { ns: 'apps-config' }),
      providers: {
        'IPSE China': 'wss://testnet-china.ipse.io',
        'IPSE USA': 'wss://testnet-usa.ipse.io',
        'IPSE Europe': 'wss://testnet-europe.ipse.io'
      }
    },
    {
      info: 'jupiter',
      text: t('rpc.jupiter', 'Jupiter', { ns: 'apps-config' }),
      providers: {
        Elara: 'wss://jupiter-poa.elara.patract.io',
        Patract: 'wss://ws.jupiter-poa.patract.cn'
      }
    },
    {
      info: 'kilt',
      text: t('rpc.kilt', 'KILT Mashnet', { ns: 'apps-config' }),
      providers: {
        'KILT Protocol': 'wss://full-nodes.kilt.io:9944/'
      }
    },
    {
      info: 'litentry',
      text: t('rpc.litentry.test', 'Litentry Testnet', { ns: 'apps-config' }),
      providers: {
        Litentry: 'wss://testnet.litentry.io'
      }
    },
    {
      info: 'acala',
      text: t('rpc.mandala', 'Mandala', { ns: 'apps-config' }),
      providers: {
        Acala: 'wss://acala-mandala.api.onfinality.io/public-ws',
        'Patract Elara': 'wss://mandala.elara.patract.io'
      }
    },
    {
      info: 'moonbaseAlpha',
      text: t('rpc.moonbeam', 'Moonbase Alpha', { ns: 'apps-config' }),
      providers: {
        'Moonbeam Network': 'wss://wss.testnet.moonbeam.network',
        OnFinality: 'wss://moonbeam-alpha.api.onfinality.io/public-ws',
        'Patract Elara': 'wss://moonbase.moonbeam.elara.patract.io'
      }
    },
    {
      info: 'mybank',
      text: t('rpc.mybank', 'mybank.network', { ns: 'apps-config' }),
      providers: {
        MYBANK: 'wss://mybank.network/substrate'
      }
    },
    {
      info: 'nftmart',
      text: t('rpc.nftmart', 'NFTMart', { ns: 'apps-config' }),
      providers: {
        NFTMartDev: 'wss://dev-ws.nftmart.io',
        NFTMartStaging: 'wss://staging-ws.nftmart.io'
      }
    },
    {
      info: 'pangolin',
      text: t('rpc.pangolin', 'Pangolin', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': 'wss://pangolin-rpc.darwinia.network'
      }
    },
    {
      info: 'phala',
      text: t('rpc.phala', 'Phala PoC-4', { ns: 'apps-config' }),
      providers: {
        'Phala Network': 'wss://poc4.phala.network/ws'
      }
    },
    {
      info: 'phoenix',
      text: t('rpc.phoenix', 'Phoenix Mashnet', { ns: 'apps-config' }),
      providers: {
        'phoenix Protocol': 'wss://phoenix-ws.coinid.pro/'
      }
    },
    {
      info: 'polkadex',
      text: t('rpc.polkadex', 'Polkadex', { ns: 'apps-config' }),
      providers: {
        'Polkadex Team': 'wss://blockchain.polkadex.trade'
      }
    },
    {
      info: 'polkabtc',
      text: t('rpc.polkabtc', 'PolkaBTC', { ns: 'apps-config' }),
      providers: {
        Interlay: 'wss://beta.polkabtc.io/api/parachain'
      }
    },
    {
      info: 'polymesh',
      text: t('rpc.polymesh', 'Polymesh ITN', { ns: 'apps-config' }),
      providers: {
        Polymath: 'wss://itn-rpc.polymesh.live'
      }
    },
    {
      info: 'prism',
      text: t('rpc.prism', 'Prism', { ns: 'apps-config' }),
      providers: {
        Prism: 'wss://testnet.psm.link'
      }
    },
    {
      info: 'realis',
      text: t('rpc.realis', 'Realis.Network', { ns: 'apps-config' }),
      providers: {
        'Realis.Network': 'wss://rpc.realis.network/'
      }
    },
    {
      info: 'riochain',
      text: t('rpc.riochain', 'RioChain', { ns: 'apps-config' }),
      providers: {
        'RioChain Staging': 'wss://node.v1.staging.riochain.io'
      }
    },
    {
      info: 'sora-substrate',
      text: t('rpc.sora-substrate-staging', 'SORA-staging', { ns: 'apps-config' }),
      providers: {
        Soramitsu: 'wss://ws.stage.sora2.soramitsu.co.jp'
      }
    },
    {
      info: 'ternoa-chaos',
      text: t('rpc.ternoa-chaos', 'Ternoa Chaos', { ns: 'apps-config' }),
      providers: {
        CapsuleCorp: 'wss://chaos.ternoa.com'
      }
    },
    {
      info: 'laminar',
      text: t('rpc.turbulence', 'Turbulence', { ns: 'apps-config' }),
      providers: {
        Laminar: 'wss://testnet-node-1.laminar-chain.laminar.one/ws'
      }
    },
    {
      info: 'uniarts',
      text: t('rpc.uniarts', 'UniArts', { ns: 'apps-config' }),
      providers: {
        UniArts: 'wss://testnet.uniarts.me'
      }
    },
    {
      info: 'unique',
      text: t('rpc.unique', 'Unique', { ns: 'apps-config' }),
      providers: {
        Unique: 'wss://testnet2.uniquenetwork.io'
      }
    },
    {
      info: 'unitv',
      text: t('rpc.unitv', 'Unit Network', { ns: 'apps-config' }),
      providers: {
        'Unit Network': 'wss://unitventures.io/'
      }
    },
    {
      info: 'vodka',
      text: t('rpc.vodka', 'Vodka', { ns: 'apps-config' }),
      providers: {
        Vodka: 'wss://vodka.rpc.neatcoin.org/ws'
      }
    },
    {
      info: 'web3games',
      text: t('rpc.web3games', 'Web3Games', { ns: 'apps-config' }),
      providers: {
        Web3Games: 'wss://substrate.org.cn:4443'
      }
    },
    {
      info: 'zeitgeist',
      text: t('rpc.zeitgeist', 'Zeitgeist Battery Park', { ns: 'apps-config' }),
      providers: {
        Zeitgeist: 'wss://bp-rpc.zeitgeist.pm'
      }
    },
    {
      info: 'zero',
      text: t('rpc.zero', 'Zero', { ns: 'apps-config' }),
      providers: {
        ZERO: 'wss://alphaville.zero.io'
      }
    }
  ]);
}
