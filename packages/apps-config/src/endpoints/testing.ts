// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from './types';

import { createProviderUrl, expandEndpoints } from './util';

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
        Centrifuge: createProviderUrl('wss://fullnode.amber.centrifuge.io')
      }
    },
    {
      info: 'nodle',
      text: t('rpc.test.nodle-arcadia', 'Arcadia', { ns: 'apps-config' }),
      providers: {
        Nodle: createProviderUrl('wss://arcadia1.nodleprotocol.io')
      }
    },
    {
      info: 'edgeware',
      text: t('rpc.test.beresheet', 'Beresheet', { ns: 'apps-config' }),
      providers: {
        'Commonwealth Labs': createProviderUrl('wss://beresheet1.edgewa.re')
      }
    },
    {
      info: 'bifrost',
      isUnreachable: true, // https://github.com/polkadot-js/apps/issues/5619
      text: t('rpc.test.bifrost', 'Bifrost Asgard', { ns: 'apps-config' }),
      providers: {
        Bifrost: createProviderUrl('wss://asgard-rpc.liebi.com/ws')
      }
    },
    {
      info: 'bitcountry',
      text: t('rpc.test.bitcountry', 'Bit.Country Tewai', { ns: 'apps-config' }),
      providers: {
        'Bit.Country': createProviderUrl('wss://whenua.bit.country')
      }
    },
    {
      info: 'canvas',
      text: t('rpc.test.canvas', 'Canvas', { ns: 'apps-config' }),
      providers: {
        Parity: createProviderUrl('wss://canvas-rpc.parity.io')
      }
    },
    {
      info: 'clover',
      isDisabled: true, // Cannot construct unknown type BridgeNetworks
      text: t('rpc.test.clover.finance', 'Clover', { ns: 'apps-config' }),
      providers: {
        Clover: createProviderUrl('wss://api.clover.finance/')
      }
    },
    {
      info: 'crust',
      text: t('rpc.test.crust.network', 'Crust Maxwell', { ns: 'apps-config' }),
      providers: {
        'Crust Network': createProviderUrl('wss://api.crust.network/'),
        'DCloud Foundation': createProviderUrl('wss://api.decloudf.com/')
      }
    },
    {
      info: 'datahighway',
      isDisabled: true,
      text: t('rpc.test.datahighway.spreehafen', 'Spreehafen', { ns: 'apps-config' }),
      providers: {
        MXC: createProviderUrl('wss://spreehafen.datahighway.com')
      }
    },
    {
      info: 'dock-testnet',
      isDisabled: false,
      text: t('rpc.test.dock-testnet', 'Dock', { ns: 'apps-config' }),
      providers: {
        'Dock Association': createProviderUrl('wss://danforth-1.dock.io')
      }
    },
    {
      info: 'dotmog',
      text: t('rpc.test.dotmog', 'DOTMog', { ns: 'apps-config' }),
      providers: {
        DOTMog: createProviderUrl('wss://mogiway-01.dotmog.com')
      }
    },
    {
      info: 'dusty',
      text: t('rpc.test.dusty', 'Dusty', { ns: 'apps-config' }),
      providers: {
        'Stake Technologies': createProviderUrl('wss://rpc.dusty.plasmnet.io/')
      }
    },
    {
      info: 'encointer_cantillon',
      text: t('rpc.test.encointer.cantillon', 'Encointer Cantillon', { ns: 'apps-config' }),
      providers: {
        'Encointer Association': createProviderUrl('wss://cantillon.encointer.org')
      }
    },
    {
      info: 'encointer_gesell',
      text: t('rpc.test.encointer.gesell', 'Encointer Gesell', { ns: 'apps-config' }),
      providers: {
        'Encointer Association': createProviderUrl('wss://gesell.encointer.org')
      }
    },
    {
      info: 'equilibrium',
      text: t('rpc.test.equilibriumtestnet', 'Equilibrium', { ns: 'apps-config' }),
      providers: {
        Equilibrium: createProviderUrl('wss://testnet.equilibrium.io')
      }
    },
    {
      info: 'substrate',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/5571
      text: t('rpc.test.flamingfir', 'Flaming Fir', { ns: 'apps-config' }),
      providers: {
        Parity: createProviderUrl('wss://substrate-rpc.parity.io')
      }
    },
    {
      info: 'Galital',
      text: t('rpc.test.galital', 'Galital PC2', { ns: 'apps-config' }),
      providers: {
        StarkleyTech: createProviderUrl('wss://galital-rpc-testnet.starkleytech.com')
      }
    },
    {
      info: 'galois',
      text: t('rpc.test.galois', 'Galois', { ns: 'apps-config' }),
      providers: {
        MathWallet: createProviderUrl('wss://galois-hk.maiziqianbao.net/ws'),
        'MathWallet Backup': createProviderUrl('wss://galois.maiziqianbao.net/ws')
      }
    },
    {
      info: 'gamepower',
      text: t('rpc.test.gamepower', 'GamePower', { ns: 'apps-config' }),
      providers: {
        GamePower: createProviderUrl('wss://gamepower.io')
      }
    },
    {
      info: 'geek',
      text: t('rpc.test.geek', 'GeekCash', { ns: 'apps-config' }),
      providers: {
        'Geek Team': createProviderUrl('wss://testnet.geekcash.org')
      }
    },
    {
      info: 'halongbay',
      text: t('rpc.test.halongbay', 'Halongbay Testnet', { ns: 'apps-config' }),
      providers: {
        Halongbay: createProviderUrl('wss://halongbay.polkafoundry.com')
      }
    },
    {
      info: 'ipse',
      text: t('rpc.test.ipse', 'IPSE', { ns: 'apps-config' }),
      providers: {
        'IPSE China': createProviderUrl('wss://testnet-china.ipse.io'),
        'IPSE USA': createProviderUrl('wss://testnet-usa.ipse.io'),
        'IPSE Europe': createProviderUrl('wss://testnet-europe.ipse.io')
      }
    },
    {
      info: 'jupiter',
      text: t('rpc.test.jupiter', 'Jupiter', { ns: 'apps-config' }),
      providers: {
        Elara: createProviderUrl('wss://jupiter-poa.elara.patract.io'),
        Patract: createProviderUrl('wss://ws.jupiter-poa.patract.cn')
      }
    },
    {
      info: 'kilt',
      text: t('rpc.test.kilt', 'KILT Mashnet', { ns: 'apps-config' }),
      providers: {
        'KILT Protocol': createProviderUrl('wss://full-nodes.kilt.io:9944/')
      }
    },
    {
      info: 'klugdossier',
      text: t('rpc.KlugDossier', 'Klug Dossier', { ns: 'apps-config' }),
      providers: {
        'Klug Dossier': createProviderUrl('wss://klugdossier.net/')
      }
    },
    {
      info: 'kylin',
      text: t('testnet.kylin-node.co.uk', 'Kylin Testnet', { ns: 'apps-config' }),
      providers: {
        'Kylin Network': createProviderUrl('wss://testnet.kylin-node.co.uk')
      }
    },
    {
      info: 'litentry',
      text: t('rpc.test.litentry', 'Litentry Testnet', { ns: 'apps-config' }),
      providers: {
        Litentry: createProviderUrl('wss://testnet.litentry.io')
      }
    },
    {
      info: 'acala',
      text: t('rpc.test.mandala', 'Mandala', { ns: 'apps-config' }),
      providers: {
        Acala: createProviderUrl('wss://acala-mandala.api.onfinality.io/public-ws'),
        'Patract Elara': createProviderUrl('wss://mandala.elara.patract.io')
      }
    },
    {
      info: 'manta',
      text: t('rpc.manta', 'Manta Testnet', { ns: 'apps-config' }),
      providers: {
        'Manta Testnet': createProviderUrl('wss://ws.f1.testnet.manta.network')
      }
    },
    {
      info: 'moonbaseAlpha',
      text: t('rpc.test.moonbeam', 'Moonbase Alpha', { ns: 'apps-config' }),
      providers: {
        'Moonbeam Network': createProviderUrl('wss://wss.testnet.moonbeam.network'),
        OnFinality: createProviderUrl('wss://moonbeam-alpha.api.onfinality.io/public-ws'),
        'Patract Elara': createProviderUrl('wss://moonbase.moonbeam.elara.patract.io')
      }
    },
    {
      info: 'mybank',
      text: t('rpc.test.mybank', 'mybank.network', { ns: 'apps-config' }),
      providers: {
        MYBANK: createProviderUrl('wss://mybank.network/substrate')
      }
    },
    {
      info: 'nftmart',
      text: t('rpc.test.nftmart', 'NFTMart', { ns: 'apps-config' }),
      providers: {
        NFTMartDev: createProviderUrl('wss://dev-ws.nftmart.io'),
        NFTMartStaging: createProviderUrl('wss://staging-ws.nftmart.io')
      }
    },
    {
      info: 'oak-testnet',
      text: t('rpc.test.oak', 'OAK Testnet', { ns: 'apps-config' }),
      providers: {
        'OAK Network': createProviderUrl('wss://rpc.testnet.oak.tech')
      }
    },
    {
      info: 'opportunity',
      text: t('rpc.test.opportunity', 'Opportunity', { ns: 'apps-config' }),
      providers: {
        Opportunity: createProviderUrl('wss://rpc.opportunity.standard.tech')
      }
    },
    {
      info: 'pangolin',
      text: t('rpc.test.pangolin', 'Pangolin', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': createProviderUrl('wss://pangolin-rpc.darwinia.network')
      }
    },
    {
      info: 'phala',
      text: t('rpc.test.phala', 'Phala PoC-4', { ns: 'apps-config' }),
      providers: {
        'Phala Network': createProviderUrl('wss://poc4.phala.network/ws')
      }
    },
    {
      info: 'phoenix',
      text: t('rpc.test.phoenix', 'Phoenix Mashnet', { ns: 'apps-config' }),
      providers: {
        'phoenix Protocol': createProviderUrl('wss://phoenix-ws.coinid.pro/')
      }
    },
    {
      info: 'polkabtc',
      text: t('rpc.test.polkabtc', 'PolkaBTC', { ns: 'apps-config' }),
      providers: {
        Interlay: createProviderUrl('wss://beta.polkabtc.io/api/parachain')
      }
    },
    {
      info: 'polkadex',
      text: t('rpc.test.polkadex', 'Polkadex', { ns: 'apps-config' }),
      providers: {
        'Polkadex Team': createProviderUrl('wss://blockchain.polkadex.trade')
      }
    },
    {
      info: 'polymesh',
      text: t('rpc.test.polymesh', 'Polymesh ITN', { ns: 'apps-config' }),
      providers: {
        Polymath: createProviderUrl('wss://itn-rpc.polymesh.live')
      }
    },
    {
      info: 'pontem',
      text: t('rpc.pontem', 'Pontem', { ns: 'apps-config' }),
      providers: {
        Pontem: createProviderUrl('wss://testnet.pontem.network/wss')
      }
    },
    {
      info: 'prism',
      text: t('rpc.test.prism', 'Prism', { ns: 'apps-config' }),
      providers: {
        Prism: createProviderUrl('wss://testnet.psm.link')
      }
    },
    {
      info: 'realis',
      text: t('rpc.test.realis', 'Realis.Network', { ns: 'apps-config' }),
      providers: {
        'Realis.Network': createProviderUrl('wss://rpc.realis.network/')
      }
    },
    {
      info: 'riochain',
      text: t('rpc.test.riochain', 'RioChain', { ns: 'apps-config' }),
      providers: {
        'RioChain Staging': createProviderUrl('wss://node.v1.staging.riochain.io')
      }
    },
    {
      info: 'sora-substrate',
      text: t('rpc.test.sora-substrate-staging', 'SORA-staging', { ns: 'apps-config' }),
      providers: {
        Soramitsu: createProviderUrl('wss://ws.stage.sora2.soramitsu.co.jp')
      }
    },
    {
      info: 'subgame',
      text: t('rpc.test.subgame', 'SubGame Staging', { ns: 'apps-config' }),
      providers: {
        SubGame: createProviderUrl('wss://staging.subgame.org')
      }
    },
    {
      info: 'ternoa-chaos',
      text: t('rpc.test.ternoa-chaos', 'Ternoa Chaos', { ns: 'apps-config' }),
      providers: {
        CapsuleCorp: createProviderUrl('wss://chaos.ternoa.com')
      }
    },
    {
      info: 'laminar',
      text: t('rpc.test.turbulence', 'Turbulence', { ns: 'apps-config' }),
      providers: {
        Laminar: createProviderUrl('wss://testnet-node-1.laminar-chain.laminar.one/ws')
      }
    },
    {
      info: 'uniarts',
      text: t('rpc.test.uniarts', 'UniArts', { ns: 'apps-config' }),
      providers: {
        UniArts: createProviderUrl('wss://testnet.uniarts.me')
      }
    },
    {
      info: 'unique',
      text: t('rpc.test.unique', 'Unique', { ns: 'apps-config' }),
      providers: {
        Unique: createProviderUrl('wss://testnet2.uniquenetwork.io')
      }
    },
    {
      info: 'unitv',
      text: t('rpc.test.unitv', 'Unit Network', { ns: 'apps-config' }),
      providers: {
        'Unit Network': createProviderUrl('wss://unitventures.io/')
      }
    },
    {
      info: 'vodka',
      text: t('rpc.test.vodka', 'Vodka', { ns: 'apps-config' }),
      providers: {
        Vodka: createProviderUrl('wss://vodka.rpc.neatcoin.org/ws')
      }
    },
    {
      info: 'web3games',
      isUnreachable: true, // https://github.com/polkadot-js/apps/runs/2755409009?check_suite_focus=true
      text: t('rpc.test.web3games', 'Web3Games', { ns: 'apps-config' }),
      providers: {
        Web3Games: createProviderUrl('wss://substrate.org.cn:4443')
      }
    },
    {
      info: 'zeitgeist',
      text: t('rpc.test.zeitgeist', 'Zeitgeist Battery Park', { ns: 'apps-config' }),
      providers: {
        Zeitgeist: createProviderUrl('wss://bp-rpc.zeitgeist.pm')
      }
    },
    {
      info: 'zero',
      text: t('rpc.test.zero', 'Zero', { ns: 'apps-config' }),
      providers: {
        ZERO: createProviderUrl('wss://alphaville.zero.io')
      }
    }
  ], firstOnly);
}
