// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types';

import { KUSAMA_GENESIS } from '../api/constants';
import { chainsAbandPNG, chainsAltairSVG, chainsAmplitudeSVG, chainsDorafactoryPNG, chainsGenshiroSVG, chainsGmJPEG, chainsKaruraSVG, chainsKicoPNG, chainsKintsugiPNG, chainsKusamaSVG, chainsListenPNG, chainsMangataPNG, chainsRiodefiPNG, chainsShidenPNG, chainsTinkerPNG, chainsTuringPNG, chainsUnorthodoxPNG } from '../ui/logos/chains';
import { nodesApronPNG, nodesAresMarsPNG, nodesBajunPNG, nodesBasiliskPNG, nodesBifrostSVG, nodesBitcountryPNG, nodesBridgeHubBlackSVG, nodesCalamariPNG, nodesCrabSVG, nodesDatahighwayPNG, nodesEncointerBlueSVG, nodesImbuePNG, nodesIntegriteeSVG, nodesIpciSVG, nodesKabochaSVG, nodesKhalaSVG, nodesLitmusPNG, nodesLoomNetworkPNG, nodesLuhnPNG, nodesMoonriverPNG, nodesParallelSVG, nodesPicassoPNG, nodesPichiuPNG, nodesPolkasmithSVG, nodesQuartzPNG, nodesRobonomicsSVG, nodesSakuraSVG, nodesShadowSVG, nodesSnowPNG, nodesSoraSubstrateSVG, nodesStatemineSVG, nodesSubgameSVG, nodesSubsocialXSVG, nodesTrustbasePNG, nodesZeitgeistPNG, nodesZeroSVG } from '../ui/logos/nodes';
import { getTeleports } from './util';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodParasKusama: EndpointOption[] = [
  {
    homepage: 'https://a.band',
    info: 'aband',
    paraId: 2257,
    providers: {
      'Aband DAO': 'wss://rpc-parachain.a.band'
    },
    text: 'Aband',
    ui: {
      color: '#7358ff',
      logo: chainsAbandPNG
    }
  },
  {
    homepage: 'https://centrifuge.io/altair',
    info: 'altair',
    paraId: 2088,
    providers: {
      Centrifuge: 'wss://fullnode.altair.centrifuge.io',
      OnFinality: 'wss://altair.api.onfinality.io/public-ws'
    },
    text: 'Altair',
    ui: {
      color: '#ffb700',
      logo: chainsAltairSVG
    }
  },
  {
    homepage: 'https://pendulumchain.org/amplitude',
    info: 'amplitude',
    paraId: 2124,
    providers: {
      Dwellir: 'wss://amplitude-rpc.dwellir.com',
      PendulumChain: 'wss://rpc-amplitude.pendulumchain.tech'
    },
    text: 'Amplitude',
    ui: {
      color: '#5DEFA7',
      logo: chainsAmplitudeSVG
    }
  },
  {
    homepage: 'https://ajuna.io',
    info: 'bajun',
    paraId: 2119,
    providers: {
      AjunaNetwork: 'wss://rpc-parachain.bajun.network',
      Dwellir: 'wss://bajun-rpc.dwellir.com',
      OnFinality: 'wss://bajun.api.onfinality.io/public-ws'
    },
    text: 'Bajun Network',
    ui: {
      color: '#161212',
      logo: nodesBajunPNG
    }
  },
  {
    homepage: 'https://app.basilisk.cloud',
    info: 'basilisk',
    paraId: 2090,
    providers: {
      Basilisk: 'wss://rpc.basilisk.cloud',
      Dwellir: 'wss://basilisk-rpc.dwellir.com'
    },
    text: 'Basilisk',
    ui: {
      color: '#49E49F',
      logo: nodesBasiliskPNG
    }
  },
  {
    homepage: 'https://ksm.vtoken.io/?ref=polkadotjs',
    info: 'bifrost',
    paraId: 2001,
    providers: {
      Dwellir: 'wss://bifrost-rpc.dwellir.com',
      Liebi: 'wss://bifrost-rpc.liebi.com/ws',
      OnFinality: 'wss://bifrost-parachain.api.onfinality.io/public-ws'
    },
    text: 'Bifrost',
    ui: {
      color: '#5a25f0',
      logo: nodesBifrostSVG
    }
  },
  {
    homepage: 'https://bit.country/?ref=polkadotjs',
    info: 'bitcountryPioneer',
    paraId: 2096,
    providers: {
      OnFinality: 'wss://pioneer.api.onfinality.io/public-ws'
    },
    text: 'Bit.Country Pioneer',
    ui: {
      color: '#000000',
      logo: nodesBitcountryPNG
    }
  },
  {
    homepage: 'https://www.calamari.network/',
    info: 'calamari',
    paraId: 2084,
    providers: {
      'Manta Network': 'wss://ws.calamari.systems/'
    },
    text: 'Calamari',
    ui: {
      color: '#000000',
      logo: nodesCalamariPNG
    }
  },
  {
    homepage: 'https://crust.network/',
    info: 'shadow',
    paraId: 2012,
    providers: {
      Crust: 'wss://rpc-shadow.crust.network/'
    },
    text: 'Crust Shadow',
    ui: {
      logo: nodesShadowSVG
    }
  },
  {
    homepage: 'https://crust.network/',
    info: 'shadow',
    isUnreachable: true,
    paraId: 2225,
    providers: {
      // also duplicated right above (hence marked unreachable)
      // Crust: 'wss://rpc-shadow.crust.network/' // https://github.com/polkadot-js/apps/issues/8355
    },
    text: 'Crust Shadow 2',
    ui: {
      logo: nodesShadowSVG
    }
  },
  {
    homepage: 'https://ipci.io',
    info: 'ipci',
    paraId: 2222,
    providers: {
      Airalab: 'wss://kusama.rpc.ipci.io'
    },
    text: 'DAO IPCI',
    ui: {
      logo: nodesIpciSVG
    }
  },
  {
    homepage: 'https://crab.network',
    info: 'crab',
    paraId: 2105,
    providers: {
      'Darwinia Network': 'wss://crab-parachain-rpc.darwinia.network/'
    },
    text: 'Darwinia Crab',
    ui: {
      color: '#512DBC',
      logo: nodesCrabSVG
    }
  },
  {
    homepage: 'https://dorafactory.org/kusama/',
    info: 'dorafactory',
    paraId: 2115,
    providers: {
      DORA: 'wss://kusama.dorafactory.org'
    },
    text: 'Dora Factory',
    ui: {
      color: '#FF761C',
      logo: chainsDorafactoryPNG
    }
  },
  {
    homepage: 'https://genshiro.equilibrium.io',
    info: 'genshiro',
    isUnreachable: true,
    paraId: 2024,
    providers: {
      Equilibrium: 'wss://node.genshiro.io'
    },
    text: 'Genshiro',
    ui: {
      color: '#e8662d',
      logo: chainsGenshiroSVG
    }
  },
  {
    homepage: 'https://genshiro.equilibrium.io',
    info: 'genshiro',
    isUnreachable: true,
    paraId: 2226,
    providers: {
      Equilibrium: 'wss://node.genshiro.io'
    },
    text: 'Genshiro crowdloan 2',
    ui: {
      color: '#e8662d',
      logo: chainsGenshiroSVG
    }
  },
  {
    homepage: 'https://gmordie.com',
    info: 'gm',
    paraId: 2123,
    providers: {
      // GMorDieDAO: 'wss://kusama.gmordie.com', // https://github.com/polkadot-js/apps/issues/8457
      'GM Intern': 'wss://intern.gmordie.com',
      // TerraBioDAO: 'wss://ws-node-gm.terrabiodao.org', // https://github.com/polkadot-js/apps/issues/8867
      Leemo: 'wss://leemo.gmordie.com',
      'bLd Nodes': 'wss://ws.gm.bldnodes.org',
      'light client': 'light://substrate-connect/kusama/gm'
    },
    text: 'GM',
    ui: {
      color: '#f47b36',
      logo: chainsGmJPEG
    }
  },
  {
    homepage: 'https://imbue.network',
    info: 'imbue',
    paraId: 2121,
    providers: {
      'Imbue Network': 'wss://imbue-kusama.imbue.network'
    },
    text: 'Imbue Network',
    ui: {
      color: '#baff36',
      logo: nodesImbuePNG
    }
  },
  {
    homepage: 'https://integritee.network',
    info: 'integritee',
    paraId: 2015,
    providers: {
      Integritee: 'wss://kusama.api.integritee.network',
      OnFinality: 'wss://integritee-kusama.api.onfinality.io/public-ws'
    },
    text: 'Integritee Network',
    ui: {
      color: '#658ea9',
      logo: nodesIntegriteeSVG
    }
  },
  {
    homepage: 'https://invarch.network/tinkernet',
    info: 'tinker',
    paraId: 2125,
    providers: {
      // 'InvArch Team': 'wss://tinker.invarch.network', // https://github.com/polkadot-js/apps/issues/8623
      OnFinality: 'wss://invarch-tinkernet.api.onfinality.io/public-ws',
      'light client': 'light://substrate-connect/kusama/tinkernet'
    },
    text: 'InvArch Tinkernet',
    ui: {
      color: '#161616',
      logo: chainsTinkerPNG
    }
  },
  {
    homepage: 'https://kabocha.network',
    info: 'kabocha',
    paraId: 2113,
    providers: {
      JelliedOwl: 'wss://kabocha.jelliedowl.net'
    },
    text: 'Kabocha',
    ui: {
      color: 'repeating-radial-gradient(black, black 4px, yellow 5px)',
      logo: nodesKabochaSVG
    }
  },
  {
    homepage: 'https://acala.network/karura/join-karura',
    info: 'karura',
    paraId: 2000,
    providers: {
      'Acala Foundation 0': 'wss://karura-rpc-0.aca-api.network',
      'Acala Foundation 1': 'wss://karura-rpc-1.aca-api.network',
      'Acala Foundation 2': 'wss://karura-rpc-2.aca-api.network/ws',
      'Acala Foundation 3': 'wss://karura-rpc-3.aca-api.network/ws',
      Dwellir: 'wss://karura-rpc.dwellir.com',
      OnFinality: 'wss://karura.api.onfinality.io/public-ws',
      'Polkawallet 0': 'wss://karura.polkawallet.io'
    },
    text: 'Karura',
    ui: {
      color: '#ff4c3b',
      logo: chainsKaruraSVG
    }
  },
  {
    homepage: 'https://phala.network/',
    info: 'khala',
    paraId: 2004,
    providers: {
      Dwellir: 'wss://khala-rpc.dwellir.com',
      OnFinality: 'wss://khala.api.onfinality.io/public-ws',
      Phala: 'wss://khala-api.phala.network/ws',
    },
    text: 'Khala Network',
    ui: {
      color: '#03f3f3',
      logo: nodesKhalaSVG
    }
  },
  {
    homepage: 'https://dico.io/',
    info: 'kico',
    paraId: 2107,
    providers: {
      'DICO Foundation': 'wss://rpc.kico.dico.io'
      // 'DICO Foundation 2': 'wss://rpc.api.kico.dico.io' // https://github.com/polkadot-js/apps/issues/8203
    },
    text: 'KICO',
    ui: {
      color: '#29B58D',
      logo: chainsKicoPNG
    }
  },
  {
    homepage: 'https://dico.io/',
    info: 'kico 2',
    paraId: 2235,
    providers: {
      // 'DICO Foundation': 'wss://rpc.kico2.dico.io' // https://github.com/polkadot-js/apps/issues/8415
    },
    text: 'KICO 2',
    ui: {
      color: '#29B58D',
      logo: chainsKicoPNG
    }
  },
  {
    homepage: 'https://kintsugi.interlay.io/',
    info: 'kintsugi',
    paraId: 2092,
    providers: {
      'Kintsugi Labs': 'wss://api-kusama.interlay.io/parachain',
      OnFinality: 'wss://kintsugi.api.onfinality.io/public-ws'
    },
    text: 'Kintsugi BTC',
    ui: {
      color: '#1a0a2d',
      logo: chainsKintsugiPNG
    }
  },
  {
    homepage: 'http://apron.network/',
    info: 'kpron',
    isUnreachable: true,
    paraId: 2019,
    providers: {
      Kpron: 'wss://kusama-kpron-rpc.apron.network/'
    },
    text: 'Kpron',
    ui: {
      color: 'linear-gradient(45deg, #0099F7 0%, #2E49EB 100%)',
      logo: nodesApronPNG
    }
  },
  {
    homepage: 'https://listen.io/',
    info: 'listen',
    paraId: 2118,
    providers: {
      'Listen Foundation 1': 'wss://rpc.mainnet.listen.io',
      'Listen Foundation 2': 'wss://wss.mainnet.listen.io'
    },
    text: 'Listen Network',
    ui: {
      color: '#FFAD0A',
      logo: chainsListenPNG
    }
  },
  {
    homepage: 'https://kusama-crowdloan.litentry.com',
    info: 'litmus',
    isUnreachable: false,
    paraId: 2106,
    providers: {
      Litentry: 'wss://rpc.litmus-parachain.litentry.io'
    },
    text: 'Litmus',
    ui: {
      color: '#6822fb',
      logo: nodesLitmusPNG
    }
  },
  {
    // https://github.com/polkadot-js/apps/issues/5888
    homepage: 'https://loomx.io/',
    info: 'loomNetwork',
    isUnreachable: true,
    paraId: 2080,
    providers: {
      LoomNetwork: 'wss://kusama.dappchains.com'
    },
    text: 'Loom Network',
    ui: {
      logo: nodesLoomNetworkPNG
    }
  },
  {
    homepage: 'https://luhn.network/',
    info: 'luhn',
    paraId: 2232,
    providers: {
      'Hashed Systems': 'wss://c1.luhn.network'
    },
    text: 'Luhn Network',
    ui: {
      color: '#2F8E85',
      logo: nodesLuhnPNG
    }
  },
  {
    homepage: 'https://mangata.finance',
    info: 'mangata',
    paraId: 2110,
    providers: {
      Mangata: 'wss://prod-kusama-collator-01.mangatafinance.cloud',
      OnFinality: 'wss://mangata-x.api.onfinality.io/public-ws'
    },
    text: 'Mangata',
    ui: {
      color: '#030408',
      logo: chainsMangataPNG
    }
  },
  {
    homepage: 'https://www.aresprotocol.io/mars',
    info: 'mars',
    paraId: 2008,
    providers: {
      // AresProtocol: 'wss://wss.mars.aresprotocol.io' // https://github.com/polkadot-js/apps/issues/8937
    },
    text: 'Mars',
    ui: {
      color: '#E56239',
      logo: nodesAresMarsPNG
    }
  },
  {
    homepage: 'https://moonbeam.network/networks/moonriver/',
    info: 'moonriver',
    paraId: 2023,
    providers: {
      Blast: 'wss://moonriver.public.blastapi.io',
      'Moonbeam Foundation': 'wss://wss.api.moonriver.moonbeam.network',
      OnFinality: 'wss://moonriver.api.onfinality.io/public-ws',
      UnitedBloc: 'wss://moonriver.unitedbloc.com:2001'
    },
    text: 'Moonriver',
    ui: {
      color: '#0E132E',
      logo: nodesMoonriverPNG
    }
  },
  {
    homepage: 'https://parallel.fi',
    info: 'heiko',
    paraId: 2085,
    providers: {
      // This is a possible false positive since OnFinality does not allow connections
      // from non polkadot.js.org urls - however until resolved, this needs to be disabled
      // since we cannot manually check the urls twice daily when they are reported
      // OnFinality: 'wss://parallel-heiko.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8973
      Parallel: 'wss://heiko-rpc.parallel.fi'
    },
    text: 'Parallel Heiko',
    ui: {
      color: '#42d5de',
      logo: nodesParallelSVG
    }
  },
  {
    homepage: 'https://parallel.fi',
    info: 'heiko',
    isUnreachable: true,
    paraId: 2126,
    providers: {},
    text: 'Parallel Heiko 2',
    ui: {
      color: '#42d5de',
      logo: nodesParallelSVG
    }
  },
  {
    homepage: 'https://picasso.composable.finance/',
    info: 'picasso',
    paraId: 2087,
    providers: {
      Composable: 'wss://rpc.composablenodes.tech'
    },
    text: 'Picasso',
    ui: {
      color: '#000000',
      logo: nodesPicassoPNG
    }
  },
  {
    homepage: 'https://kylin.network/',
    info: 'pichiu',
    paraId: 2102,
    providers: {
      'Kylin Network': 'wss://kusama.kylin-node.co.uk'
    },
    text: 'Pichiu',
    ui: {
      color: '#ed007e',
      logo: nodesPichiuPNG
    }
  },
  {
    homepage: 'https://polkasmith.polkafoundry.com/',
    info: 'polkasmith',
    paraId: 2009,
    providers: {
      // PolkaSmith: 'wss://wss-polkasmith.polkafoundry.com' // https://github.com/polkadot-js/apps/issues/6595
    },
    text: 'PolkaSmith by PolkaFoundry',
    ui: {
      color: '#0DDDFB',
      logo: nodesPolkasmithSVG
    }
  },
  {
    homepage: 'https://unique.network/',
    info: 'quartz',
    paraId: 2095,
    providers: {
      // This is a possible false positive since OnFinality does not allow connections
      // from non polkadot.js.org urls - however until resolved, this needs to be disabled
      // since we cannot manually check the urls twice daily when they are reported
      // OnFinality: 'wss://quartz.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/8973
      'Unique America': 'wss://us-ws-quartz.unique.network',
      'Unique Asia': 'wss://asia-ws-quartz.unique.network',
      'Unique Europe': 'wss://eu-ws-quartz.unique.network'
    },
    text: 'QUARTZ by UNIQUE',
    ui: {
      color: '#FF4D6A',
      logo: nodesQuartzPNG
    }
  },
  {
    homepage: 'https://riodefi.com',
    info: 'riodefi',
    paraId: 2227,
    providers: {
      RioProtocol: 'wss://rio-kusama.riocorenetwork.com'
    },
    text: 'RioDeFi',
    ui: {
      color: '#4E7AED',
      logo: chainsRiodefiPNG
    }
  },
  {
    homepage: 'http://robonomics.network/',
    info: 'robonomics',
    paraId: 2048,
    providers: {
      Airalab: 'wss://kusama.rpc.robonomics.network/',
      Leemo: 'wss://robonomics.leemo.me',
      OnFinality: 'wss://robonomics.api.onfinality.io/public-ws',
      Samsara: 'wss://robonomics.0xsamsara.com'
    },
    text: 'Robonomics',
    ui: {
      color: '#2949d3',
      logo: nodesRobonomicsSVG
    }
  },
  {
    homepage: 'http://robonomics.network/',
    info: 'robonomics',
    isUnreachable: true,
    paraId: 2240,
    providers: {
      Airalab: 'wss://kusama.rpc.robonomics.network/',
      Leemo: 'wss://robonomics.leemo.me',
      OnFinality: 'wss://robonomics.api.onfinality.io/public-ws',
      Samsara: 'wss://robonomics.0xsamsara.com'
    },
    text: 'Robonomics 2',
    ui: {
      color: '#2949d3',
      logo: nodesRobonomicsSVG
    }
  },
  {
    homepage: 'https://clover.finance/',
    info: 'sakura',
    isUnreachable: true,
    paraId: 2016,
    providers: {
      Clover: 'wss://api-sakura.clover.finance'
    },
    text: 'Sakura',
    ui: {
      color: '#ff5995',
      logo: nodesSakuraSVG
    }
  },
  {
    homepage: 'https://shiden.astar.network/',
    info: 'shiden',
    paraId: 2007,
    providers: {
      Blast: 'wss://shiden.public.blastapi.io',
      Dwellir: 'wss://shiden-rpc.dwellir.com',
      OnFinality: 'wss://shiden.api.onfinality.io/public-ws',
      StakeTechnologies: 'wss://rpc.shiden.astar.network',
      'light client': 'light://substrate-connect/kusama/shiden'
    },
    text: 'Shiden',
    ui: {
      color: '#5923B2',
      logo: chainsShidenPNG
    }
  },
  {
    homepage: 'https://shiden.astar.network/',
    info: 'shiden',
    isUnreachable: true,
    paraId: 2120,
    providers: {
      StakeTechnologies: 'wss://rpc.shiden.astar.network'
    },
    text: 'Shiden Crowdloan 2',
    ui: {
      color: '#5923B2',
      logo: chainsShidenPNG
    }
  },
  {
    homepage: 'https://icenetwork.io/snow',
    info: 'snow',
    isUnreachable: false,
    paraId: 2129,
    providers: {
      IceNetwork: 'wss://snow-rpc.icenetwork.io'
    },
    text: 'SNOW Network',
    ui: {
      logo: nodesSnowPNG
    }
  },
  {
    homepage: 'https://sora.org/',
    info: 'sora_ksm',
    paraId: 2011,
    providers: {
      Soramitsu: 'wss://ws.parachain-collator-1.c1.sora2.soramitsu.co.jp'
    },
    text: 'SORA',
    ui: {
      color: '#2D2926',
      logo: nodesSoraSubstrateSVG
    }
  },
  {
    homepage: 'http://subgame.org/',
    info: 'subgame',
    isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7982
    paraId: 2018,
    providers: {
      SubGame: 'wss://gamma.subgame.org/'
    },
    text: 'SubGame Gamma',
    ui: {
      color: '#EB027D',
      logo: nodesSubgameSVG
    }
  },
  {
    homepage: 'https://subsocial.network/',
    info: 'subsocialX',
    paraId: 2100,
    providers: {
      'Dappforce 1': 'wss://para.subsocial.network'
    },
    text: 'SubsocialX',
    ui: {
      color: '#69058C',
      logo: nodesSubsocialXSVG
    }
  },
  {
    homepage: 'https://zero.io',
    info: 'zero',
    paraId: 2236,
    providers: {
      ZeroNetwork: 'wss://rpc-1.kusama.node.zero.io'
    },
    text: 'subzero',
    ui: {
      color: '#000000',
      logo: nodesZeroSVG
    }
  },
  {
    homepage: 'https://www.datahighway.com/',
    info: 'tanganika',
    paraId: 2116,
    providers: {
      DataHighway: 'wss://tanganika.datahighway.com'
    },
    text: 'Tanganika',
    ui: {
      color: 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)',
      logo: nodesDatahighwayPNG
    }
  },
  {
    homepage: 'https://trustbase.network/',
    info: 'trustbase',
    isUnreachable: true,
    paraId: 2078,
    providers: {},
    text: 'TrustBase',
    ui: {
      color: '#ff43aa',
      logo: nodesTrustbasePNG
    }
  },
  {
    homepage: 'https://oak.tech',
    info: 'turing',
    paraId: 2114,
    providers: {
      Dwellir: 'wss://turing-rpc.dwellir.com',
      OAK: 'wss://rpc.turing.oak.tech'
    },
    text: 'Turing Network',
    ui: {
      color: '#A8278C',
      logo: chainsTuringPNG
    }
  },
  {
    homepage: 'https://standard.tech/',
    info: 'unorthodox',
    paraId: 2094,
    providers: {
      // 'Standard Protocol': 'wss://rpc.kusama.standard.tech' // https://github.com/polkadot-js/apps/issues/8525
    },
    text: 'Unorthodox',
    ui: {
      color: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(42,244,187,1) 35%, rgba(10,10,10,1) 100%)',
      logo: chainsUnorthodoxPNG
    }
  },
  {
    homepage: 'https://zeitgeist.pm',
    info: 'zeitgeist',
    paraId: 2101,
    providers: {
      // ZeitgeistPM: 'wss://rpc-0.zeitgeist.pm', // https://github.com/polkadot-js/apps/issues/7982
      Dwellir: 'wss://zeitgeist-rpc.dwellir.com',
      OnFinality: 'wss://zeitgeist.api.onfinality.io/public-ws'
    },
    text: 'Zeitgeist',
    ui: {
      color: 'linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)',
      logo: nodesZeitgeistPNG
    }
  }
];

export const prodParasKusamaCommon: EndpointOption[] = [
  {
    info: 'statemine',
    paraId: 1000,
    providers: {
      Dwellir: 'wss://statemine-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://statemine-rpc-tn.dwellir.com',
      OnFinality: 'wss://statemine.api.onfinality.io/public-ws',
      Parity: 'wss://statemine-rpc.polkadot.io',
      RadiumBlock: 'wss://statemine.public.curie.radiumblock.co/ws'
    },
    teleport: [-1],
    text: 'Statemine',
    ui: {
      color: '#113911',
      logo: nodesStatemineSVG
    }
  },
  {
    homepage: 'https://encointer.org/',
    info: 'encointer',
    paraId: 1001,
    providers: {
      'Encointer Association': 'wss://kusama.api.encointer.org',
      OnFinality: 'wss://encointer.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/8553, reenabled for Polkadot JS
    },
    teleport: [-1],
    text: 'Encointer Network',
    ui: {
      color: '#0000cc',
      logo: nodesEncointerBlueSVG
    }
  },
  {
    info: 'kusamaBridgeHub',
    paraId: 1002,
    providers: {
      Parity: 'wss://kusama-bridge-hub-rpc.polkadot.io'
    },
    text: 'BridgeHub',
    ui: {
      logo: nodesBridgeHubBlackSVG
    }
  }
];

export const prodRelayKusama: EndpointOption = {
  dnslink: 'kusama',
  genesisHash: KUSAMA_GENESIS,
  info: 'kusama',
  linked: [
    ...prodParasKusamaCommon,
    ...prodParasKusama
  ],
  providers: {
    // 'Geometry Labs': 'wss://kusama.geometry.io/websockets', // https://github.com/polkadot-js/apps/pull/6746
    'Automata 1RPC': 'wss://1rpc.io/ksm',
    'Dotters Net': 'wss://rpc.dotters.network/kusama',
    Dwellir: 'wss://kusama-rpc.dwellir.com',
    'Dwellir Tunisia': 'wss://kusama-rpc-tn.dwellir.com',
    'IBP Network': 'wss://rpc.ibp.network/kusama',
    OnFinality: 'wss://kusama.api.onfinality.io/public-ws',
    Parity: 'wss://kusama-rpc.polkadot.io',
    RadiumBlock: 'wss://kusama.public.curie.radiumblock.co/ws',
    'light client': 'light://substrate-connect/kusama'
  },
  teleport: getTeleports(prodParasKusamaCommon),
  text: 'Kusama',
  ui: {
    color: '#000000',
    logo: chainsKusamaSVG
  }
};
