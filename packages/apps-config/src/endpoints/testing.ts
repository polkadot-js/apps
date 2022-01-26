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

export function createTesting (t: TFunction, firstOnly: boolean, withSort: boolean): LinkOption[] {
  return expandEndpoints(t, [
    // alphabetical based on chain name, e.g. Amber, Arcadia, Beresheet, ...
    {
      info: 'aleph',
      text: t('rpc.test.aleph', 'Aleph Zero Testnet', { ns: 'apps-config' }),
      providers: {
        'Aleph Zero Foundation': 'wss://ws.test.azero.dev'
      }
    },
    {
      info: 'centrifuge',
      text: t('rpc.test.amber', 'Amber', { ns: 'apps-config' }),
      providers: {
        Centrifuge: 'wss://fullnode.amber.centrifuge.io'
      }
    },
    {
      info: 'nodle',
      text: t('rpc.test.nodle-arcadia', 'Arcadia', { ns: 'apps-config' }),
      providers: {
        Nodle: 'wss://arcadia1.nodleprotocol.io'
      }
    },
    {
      info: 'Ares Gladios',
      text: t('rpc.test.ares.network', 'Ares Gladios', { ns: 'apps-config' }),
      providers: {
        'Ares Protocol': 'wss://gladios.aresprotocol.io'
      }
    },
    {
      info: 'automata-contextfree',
      text: t('rpc.test.automata-contextfree', 'Automata ContextFree', { ns: 'apps-config' }),
      providers: {
        'Automata Network': 'wss://cf-api.ata.network',
        OnFinality: 'wss://contextfree.api.onfinality.io/public-ws'
      }
    },
    {
      info: 'edgeware',
      text: t('rpc.test.beresheet', 'Beresheet', { ns: 'apps-config' }),
      providers: {
        'Commonwealth Labs': 'wss://beresheet.edgewa.re'
      }
    },
    {
      info: 'bifrost',
      text: t('rpc.test.bifrost', 'Bifrost', { ns: 'apps-config' }),
      providers: {
        Liebi: 'wss://asgard-rpc.liebi.com/ws'
      }
    },
    {
      info: 'bitcountry',
      text: t('rpc.test.bitcountry', 'Bit.Country - Metaverse Network', { ns: 'apps-config' }),
      providers: {
        'Metaverse Foundation': 'wss://tewai-rpc.bit.country'
      }
    },
    {
      info: 'clover',
      isDisabled: true, // Cannot construct unknown type BridgeNetworks
      text: t('rpc.test.clover.finance', 'Clover', { ns: 'apps-config' }),
      providers: {
        Clover: 'wss://api.clover.finance/'
      }
    },
    {
      // this is also a duplicate as a parachain under Polkadot and live under production -
      // it is either/or, not and
      info: 'coinversation',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6635
      text: t('rpc.test.coinversation', 'Coinversation', { ns: 'apps-config' }),
      providers: {
        Coinversation: 'wss://rpc.coinversation.io/'
      }
    },
    {
      info: 'Crust Maxwell',
      text: t('rpc.test.crust.network', 'Crust Maxwell', { ns: 'apps-config' }),
      providers: {
        'Crust Network': 'wss://api.crust.network/',
        'DCloud Foundation': 'wss://api.decloudf.com/',
        Pinknode: 'wss://rpc.pinknode.io/maxwell/explorer'
      }
    },
    {
      info: 'datahighway',
      isDisabled: true,
      text: t('rpc.test.datahighway.spreehafen', 'Spreehafen', { ns: 'apps-config' }),
      providers: {
        MXC: 'wss://spreehafen.datahighway.com'
      }
    },
    {
      info: 'dock-testnet',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6831
      text: t('rpc.test.dock-pos-testnet', 'Dock', { ns: 'apps-config' }),
      providers: {
        'Dock Association': 'wss://knox-1.dock.io'
      }
    },
    {
      info: 'dolphin',
      text: t('rpc.dolphin', 'Dolphin Testnet', { ns: 'apps-config' }),
      providers: {
        'Dolphin Testnet': 'wss://trillian.dolphin.red'
      }
    },
    {
      info: 'dotmog',
      text: t('rpc.test.dotmog', 'DOTMog', { ns: 'apps-config' }),
      providers: {
        DOTMog: 'wss://mogiway-01.dotmog.com'
      }
    },
    {
      info: 'dusty',
      text: t('rpc.test.dusty', 'Dusty', { ns: 'apps-config' }),
      providers: {
        'Stake Technologies': 'wss://rpc.dusty.plasmnet.io/',
        Pinknode: 'wss://rpc.pinknode.io/dusty/explorer'
      }
    },
    {
      info: 'encointer',
      text: t('rpc.test.encointer.gesell', 'Encointer Gesell', { ns: 'apps-config' }),
      providers: {
        'Encointer Association': 'wss://gesell.encointer.org'
      }
    },
    {
      info: 'equilibrium',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6250
      text: t('rpc.test.equilibriumtestnet', 'Equilibrium', { ns: 'apps-config' }),
      providers: {
        Equilibrium: 'wss://testnet.equilibrium.io'
      }
    },
    {
      info: 'substrate',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/5571
      text: t('rpc.test.flamingfir', 'Flaming Fir', { ns: 'apps-config' }),
      providers: {
        Parity: 'wss://substrate-rpc.parity.io'
      }
    },
    {
      info: 'fantour',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6519
      text: t('rpc.test.fantour', 'Fantour', { ns: 'apps-config' }),
      providers: {
        FantourDev: 'wss://test-ws.fantour.io'
      }
    },
    {
      info: 'Galital',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6721
      text: t('rpc.test.galital', 'Galital PC2', { ns: 'apps-config' }),
      providers: {
        StarkleyTech: 'wss://galital-rpc-testnet.starkleytech.com'
      }
    },
    {
      info: 'galois',
      text: t('rpc.test.galois', 'Galois', { ns: 'apps-config' }),
      providers: {
        MathWallet: 'wss://galois-hk.maiziqianbao.net/ws',
        'MathWallet Backup': 'wss://galois.maiziqianbao.net/ws'
      }
    },
    {
      info: 'gamepower',
      text: t('rpc.test.gamepower', 'GamePower', { ns: 'apps-config' }),
      providers: {
        GamePower: 'wss://gamepower.io'
      }
    },
    {
      info: 'geek',
      text: t('rpc.test.geek', 'GeekCash', { ns: 'apps-config' }),
      providers: {
        'Geek Team': 'wss://testnet.geekcash.org'
      }
    },
    {
      info: 'halongbay',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6871
      text: t('rpc.test.halongbay', 'Halongbay Testnet', { ns: 'apps-config' }),
      providers: {
        Halongbay: 'wss://halongbay.polkafoundry.com'
      }
    },
    {
      info: 'interbtc',
      text: t('rpc.test.interbtc', 'Interlay', { ns: 'apps-config' }),
      providers: {
        Interlay: 'wss://api.interlay.io/parachain/'
      }
    },
    {
      info: 'ipse',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6242
      text: t('rpc.test.ipse', 'IPSE', { ns: 'apps-config' }),
      providers: {
        'IPSE China': 'wss://testnet-china.ipse.io',
        'IPSE USA': 'wss://testnet-usa.ipse.io',
        'IPSE Europe': 'wss://testnet-europe.ipse.io'
      }
    },
    {
      info: 'jupiter',
      text: t('rpc.test.jupiter', 'Jupiter', { ns: 'apps-config' }),
      providers: {
        Patract: 'wss://ws.jupiter-poa.patract.cn'
      }
    },
    {
      info: 'phala',
      text: t('rpc.test.phala', 'Khala (Para3)', { ns: 'apps-config' }),
      providers: {
        'Phala Network': 'wss://pc-test-3.phala.network/khala/ws'
      }
    },
    {
      info: 'kilt',
      text: t('rpc.test.kilt.mash', 'KILT Mashnet', { ns: 'apps-config' }),
      providers: {
        'KILT Protocol': 'wss://full-nodes.kilt.io:9944/'
      }
    },
    {
      info: 'kilt',
      text: t('rpc.test.kilt.pere', 'KILT Peregrine', { ns: 'apps-config' }),
      providers: {
        'KILT Protocol': 'wss://peregrine.kilt.io/parachain-public-ws/'
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
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6635
      text: t('testnet.kylin-node.co.uk', 'Kylin Testnet', { ns: 'apps-config' }),
      providers: {
        'Kylin Network': 'wss://testnet.kylin-node.co.uk'
      }
    },
    {
      info: 'litentry',
      text: t('rpc.test.litentry', 'Litentry Testnet', { ns: 'apps-config' }),
      providers: {
        Litentry: 'wss://testnet.litentry.io'
      }
    },
    {
      info: 'acala',
      text: t('rpc.test.mandala', 'Mandala', { ns: 'apps-config' }),
      providers: {
        Acala: 'wss://mandala.polkawallet.io',
        Pinknode: 'wss://rpc.pinknode.io/mandala/explorer'
      }
    },
    {
      info: 'manta',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6384
      text: t('rpc.manta', 'Manta Testnet', { ns: 'apps-config' }),
      providers: {
        'Manta Testnet': 'wss://ws.f1.testnet.manta.network'
      }
    },
    {
      info: 'moonbaseAlpha',
      text: t('rpc.test.moonbeam', 'Moonbase Alpha', { ns: 'apps-config' }),
      providers: {
        'Moonbeam Foundation': 'wss://wss.api.moonbase.moonbeam.network',
        OnFinality: 'wss://moonbeam-alpha.api.onfinality.io/public-ws',
        Pinknode: 'wss://rpc.pinknode.io/alphanet/explorer'
      }
    },
    {
      info: 'mybank',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/5845
      text: t('rpc.test.mybank', 'mybank.network', { ns: 'apps-config' }),
      providers: {
        MYBANK: 'wss://mybank.network/substrate'
      }
    },
    {
      info: 'neumann',
      text: t('rpc.test.oak', 'Neumann Network', { ns: 'apps-config' }),
      providers: {
        OnFinality: 'wss://neumann.api.onfinality.io/public-ws'
      }
    },
    {
      info: 'nftmart',
      text: t('rpc.test.nftmart', 'NFTMart', { ns: 'apps-config' }),
      providers: {
        NFTMartDev: 'wss://dev-ws.nftmart.io',
        NFTMartStaging: 'wss://staging-ws.nftmart.io'
      }
    },
    {
      info: 'opal',
      text: t('opal.unique.network', 'OPAL by UNIQUE', { ns: 'apps-config' }),
      providers: {
        Unique: 'wss://opal.unique.network'
      }
    },
    {
      info: 'opportunity',
      text: t('rpc.test.opportunity', 'Opportunity', { ns: 'apps-config' }),
      providers: {
        'Standard Protocol': 'wss://rpc.opportunity.standard.tech'
      }
    },
    {
      info: 'origintrail-parachain-testnet',
      text: t('rpc.test.origintrail', 'OriginTrail Parachain Testnet', { ns: 'apps-config' }),
      providers: {
        'Trace Labs': 'wss://parachain-rpc.origin-trail.network'
      }
    },
    {
      info: 'pangolin',
      text: t('rpc.test.pangolin', 'Pangolin', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': 'wss://pangolin-rpc.darwinia.network'
      }
    },
    {
      info: 'pangoro',
      text: t('rpc.test.pangoro', 'Pangoro', { ns: 'apps-config' }),
      providers: {
        'Darwinia Network': 'wss://pangoro-rpc.darwinia.network'
      }
    },
    {
      info: 'phoenix',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6181
      text: t('rpc.test.phoenix', 'Phoenix Mashnet', { ns: 'apps-config' }),
      providers: {
        'phoenix Protocol': 'wss://phoenix-ws.coinid.pro/'
      }
    },
    {
      info: 'pichiu',
      isDisabled: true, // https://github.com/polkadot-js/apps/pull/6761
      text: t('rpc.test.kylin-node.co.uk', 'Pichiu Testnet', { ns: 'apps-config' }),
      providers: {
        'Kylin Network': 'wss://westend.kylin-node.co.uk'
      }
    },
    {
      info: 'polkadex',
      text: t('rpc.test.polkadex', 'Polkadex', { ns: 'apps-config' }),
      providers: {
        'Polkadex Team': 'wss://blockchain.polkadex.trade'
      }
    },
    {
      info: 'polymesh',
      text: t('rpc.test.polymesh', 'Polymesh Testnet', { ns: 'apps-config' }),
      providers: {
        Polymath: 'wss://testnet-rpc.polymesh.live'
      }
    },
    {
      info: 'pontem',
      text: t('rpc.test.pontem', 'Pontem', { ns: 'apps-config' }),
      providers: {
        Pontem: 'wss://testnet.pontem.network/ws'
      }
    },
    {
      info: 'prism',
      text: t('rpc.test.prism', 'Prism', { ns: 'apps-config' }),
      providers: {
        Prism: 'wss://testnet.psm.link'
      }
    },
    {
      info: 'realis',
      text: t('rpc.test.realis', 'Realis.Network', { ns: 'apps-config' }),
      providers: {
        'Realis.Network': 'wss://rpc.realis.network/'
      }
    },
    {
      info: 'riochain',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/6181
      text: t('rpc.test.riochain', 'RioChain', { ns: 'apps-config' }),
      providers: {
        'RioChain Staging': 'wss://node.v1.staging.riochain.io'
      }
    },
    {
      info: 'sherpax',
      text: t('rpc.test.sherpax', 'Sherpax Testnet', { ns: 'apps-config' }),
      providers: {
        Chainx: 'wss://sherpax-testnet.chainx.org'
      }
    },
    {
      info: 'shibuya',
      text: t('rpc.test.shibuya', 'Shibuya', { ns: 'apps-config' }),
      providers: {
        StakeTechnologies: 'wss://rpc.shibuya.astar.network'
      }
    },
    {
      info: 'snowbridge',
      text: t('rpc.test.snowbridge', 'Snowbridge', { ns: 'apps-config' }),
      providers: {
        Snowfork: 'wss://parachain-rpc.snowbridge.network'
      }
    },
    {
      info: 'sora-substrate',
      text: t('rpc.test.sora-substrate-staging', 'SORA-staging', { ns: 'apps-config' }),
      providers: {
        Soramitsu: 'wss://ws.stage.sora2.soramitsu.co.jp'
      }
    },
    {
      info: 'subdao',
      text: t('rpc.test.subdao', 'SubDAO Staging', { ns: 'apps-config' }),
      providers: {
        SubDAO: 'wss://alpha.subdao.org'
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
      info: 'subspace-farmnet',
      text: t('rpc.test.subspace.farmnet', 'Subspace Farmnet', { ns: 'apps-config' }),
      providers: {
        'Subspace Network': 'wss://farm-rpc.subspace.network'
      }
    },
    {
      info: 'subspace',
      text: t('rpc.test.subspace', 'Subspace Testnet', { ns: 'apps-config' }),
      providers: {
        'Subspace Network': 'wss://test-rpc.subspace.network'
      }
    },
    {
      info: 'ternoa-testnet',
      text: t('rpc.test.ternoa-testnet', 'Ternoa Testnet', { ns: 'apps-config' }),
      providers: {
        CapsuleCorp: 'wss://testnet.ternoa.com/'
      }
    },
    {
      info: 'laminar',
      text: t('rpc.test.turbulence', 'Turbulence', { ns: 'apps-config' }),
      providers: {
        Laminar: 'wss://testnet-node-1.laminar-chain.laminar.one/ws'
      }
    },
    {
      info: 'uniarts',
      text: t('rpc.test.uniarts', 'UniArts', { ns: 'apps-config' }),
      providers: {
        UniArts: 'wss://testnet.uniarts.network'
      }
    },
    {
      info: 'unique',
      text: t('rpc.test.unique', 'Unique', { ns: 'apps-config' }),
      providers: {
        Unique: 'wss://testnet2.unique.network'
      }
    },
    {
      info: 'unitv',
      isDisabled: true, // https://github.com/polkadot-js/apps/issues/5684
      text: t('rpc.test.unitv', 'Unit Network', { ns: 'apps-config' }),
      providers: {
        'Unit Network': 'wss://unitventures.io/'
      }
    },
    {
      info: 'vodka',
      text: t('rpc.test.vodka', 'Vodka', { ns: 'apps-config' }),
      providers: {
        Vodka: 'wss://vodka.rpc.neatcoin.org/ws'
      }
    },
    {
      info: 'web3games',
      text: t('rpc.test.web3games', 'Web3Games', { ns: 'apps-config' }),
      providers: {
        Web3Games: 'wss://testnet.web3games.org'
      }
    },
    {
      info: 'zCloak',
      text: t('rpc.test.zCloak', 'zCloak-network', { ns: 'apps-config' }),
      providers: {
        'zCloak Network': 'wss://test1.zcloak.network'
      }
    },
    {
      info: 'zeitgeist',
      text: t('rpc.test.zeitgeist', 'Zeitgeist Battery Station', { ns: 'apps-config' }),
      providers: {
        Zeitgeist: 'wss://bsr.zeitgeist.pm'
      }
    },
    {
      info: 'zero',
      text: t('rpc.test.zero', 'Zero', { ns: 'apps-config' }),
      providers: {
        ZERO: 'wss://alphaville.zero.io'
      }
    }
  ], firstOnly, withSort);
}
