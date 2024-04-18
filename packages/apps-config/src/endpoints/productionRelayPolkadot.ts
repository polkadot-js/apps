// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { POLKADOT_GENESIS } from '../api/constants.js';
import { chainsAcalaSVG, chainsBitgreenPNG, chainsComposableFinancePNG, chainsEquilibriumSVG, chainsFrequencySVG, chainsGeminisPNG, chainsInvarchJPEG, chainsLaosPNG, chainsLogionPNG, chainsNeurowebPNG, chainsOakPNG, chainsPeaqPNG, chainsPendulumSVG, chainsPolkadotCircleSVG, chainsSnakenetSVG, chainsTotemSVG, chainsWatrPNG } from '../ui/logos/chains/index.js';
import { nodesAjunaPNG, nodesAresOdysseySVG, nodesAssetHubSVG, nodesAstarPNG, nodesAventusSVG, nodesBifrostSVG, nodesBridgeHubSVG, nodesCentrifugePNG, nodesCloverSVG, nodesCoinversationPNG, nodesContinuumPNG, nodesCrustParachainSVG, nodesDarwiniaSVG, nodesEfinitySVG, nodesEwxSVG, nodesHashedPNG, nodesHyperbridgeSVG, nodesIntegriteeSVG, nodesInterlaySVG, nodesKiltPNG, nodesKylinPNG, nodesLitentryPNG, nodesMantaPNG, nodesMoonbeamSVG, nodesMoonsamaSVG, nodesMythosPNG, nodesNodleSVG, nodesOmnibtcSVG, nodesParallelSVG, nodesPhalaSVG, nodesPolimecSVG, nodesPolkadexSVG, nodesSoraSubstrateSVG, nodesSubdaoPNG, nodesSubgameSVG, nodesSubsocialSVG, nodesT3rnPNG, nodesUniqueSVG, nodesZeitgeistPNG } from '../ui/logos/nodes/index.js';
import { getTeleports } from './util.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const prodParasPolkadot: Omit<EndpointOption, 'teleport'>[] = [
  {
    homepage: 'https://acala.network/',
    info: 'acala',
    paraId: 2000,
    providers: {
      'Acala Foundation 0': 'wss://acala-rpc-0.aca-api.network',
      'Acala Foundation 1': 'wss://acala-rpc-1.aca-api.network',
      // 'Acala Foundation 2': 'wss://acala-rpc-2.aca-api.network/ws', // https://github.com/polkadot-js/apps/issues/6965
      'Acala Foundation 3': 'wss://acala-rpc-3.aca-api.network/ws',
      Dwellir: 'wss://acala-rpc.dwellir.com',
      LuckyFriday: 'wss://rpc-acala.luckyfriday.io',
      // 'Automata 1RPC': 'wss://1rpc.io/aca' // https://github.com/polkadot-js/apps/issues/8648
      OnFinality: 'wss://acala-polkadot.api.onfinality.io/public-ws'
      // 'Polkawallet 0': 'wss://acala.polkawallet.io' // https://github.com/polkadot-js/apps/issues/9760
    },
    text: 'Acala',
    ui: {
      color: '#645AFF',
      logo: chainsAcalaSVG
    }
  },
  {
    homepage: 'https://ajuna.io',
    info: 'ajuna',
    paraId: 2051,
    providers: {
      // AjunaNetwork: 'wss://rpc-parachain.ajuna.network', // https://github.com/polkadot-js/apps/issues/10172
      OnFinality: 'wss://ajuna.api.onfinality.io/public-ws',
      RadiumBlock: 'wss://ajuna.public.curie.radiumblock.co/ws'
    },
    text: 'Ajuna Network',
    ui: {
      color: '#161212',
      logo: nodesAjunaPNG
    }
  },
  {
    homepage: 'https://www.aresprotocol.io/',
    info: 'odyssey',
    paraId: 2028,
    providers: {
      // AresProtocol: 'wss://wss.odyssey.aresprotocol.io' // https://github.com/polkadot-js/apps/issues/9059
    },
    text: 'Ares Odyssey',
    ui: {
      color: '#1295F0',
      logo: nodesAresOdysseySVG
    }
  },
  {
    homepage: 'https://astar.network',
    info: 'astar',
    paraId: 2006,
    providers: {
      Astar: 'wss://rpc.astar.network',
      'Automata 1RPC': 'wss://1rpc.io/astr',
      Blast: 'wss://astar.public.blastapi.io',
      Dwellir: 'wss://astar-rpc.dwellir.com',
      OnFinality: 'wss://astar.api.onfinality.io/public-ws',
      RadiumBlock: 'wss://astar.public.curie.radiumblock.co/ws',
      'light client': 'light://substrate-connect/polkadot/astar'
    },
    text: 'Astar',
    ui: {
      color: '#1b6dc1d9',
      logo: nodesAstarPNG
    }
  },
  {
    homepage: 'https://www.aventus.io/',
    info: 'aventus',
    paraId: 2056,
    providers: {
      Aventus: 'wss://public-rpc.mainnet.aventus.io'
    },
    text: 'Aventus',
    ui: {
      color: '#1d2733',
      logo: nodesAventusSVG
    }
  },
  {
    homepage: 'https://crowdloan.bifrost.app',
    info: 'bifrost',
    paraId: 2030,
    providers: {
      Dwellir: 'wss://bifrost-polkadot-rpc.dwellir.com',
      Liebi: 'wss://hk.p.bifrost-rpc.liebi.com/ws',
      LiebiEU: 'wss://eu.bifrost-polkadot-rpc.liebi.com/ws',
      OnFinality: 'wss://bifrost-polkadot.api.onfinality.io/public-ws'
    },
    text: 'Bifrost',
    ui: {
      color: '#5a25f0',
      logo: nodesBifrostSVG
    }
  },
  {
    homepage: 'https://www.bitgreen.org',
    info: 'bitgreen',
    paraId: 2048,
    providers: {
      Bitgreen: 'wss://mainnet.bitgreen.org'
      // OnFinality: 'wss://bitgreen.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9993
    },
    text: 'Bitgreen',
    ui: {
      color: '#224851',
      logo: chainsBitgreenPNG
    }
  },
  {
    homepage: 'https://centrifuge.io',
    info: 'centrifuge',
    paraId: 2031,
    providers: {
      Centrifuge: 'wss://fullnode.centrifuge.io',
      Dwellir: 'wss://centrifuge-rpc.dwellir.com',
      LuckyFriday: 'wss://rpc-centrifuge.luckyfriday.io',
      OnFinality: 'wss://centrifuge-parachain.api.onfinality.io/public-ws'
    },
    text: 'Centrifuge',
    ui: {
      color: '#fcc367',
      logo: nodesCentrifugePNG
    }
  },
  {
    homepage: 'https://clover.finance',
    info: 'clover',
    paraId: 2002,
    providers: {
      // Clover: 'wss://rpc-para.clover.finance' // https://github.com/polkadot-js/apps/issues/10172
      // OnFinality: 'wss://clover.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9986
    },
    text: 'Clover',
    ui: {
      color: 'linear-gradient(to right, #52ad75, #7cc773)',
      logo: nodesCloverSVG
    }
  },
  {
    homepage: 'http://www.coinversation.io/',
    info: 'coinversation',
    paraId: 2027,
    providers: {
      // Coinversation: 'wss://rpc.coinversation.io/' // https://github.com/polkadot-js/apps/issues/6635
    },
    text: 'Coinversation',
    ui: {
      color: '#e6017a',
      logo: nodesCoinversationPNG
    }
  },
  {
    homepage: 'https://composable.finance/',
    info: 'composable',
    paraId: 2019,
    providers: {
      Composable: 'wss://rpc.composable.finance',
      Dwellir: 'wss://composable-rpc.dwellir.com'
      // OnFinality: 'wss://composable.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9986
    },
    text: 'Composable Finance',
    ui: {
      color: '#C90E8A',
      logo: chainsComposableFinancePNG
    }
  },
  {
    homepage: 'https://mnet.io/?ref=polkadotjs',
    info: 'continuum',
    paraId: 3346,
    providers: {
      MNet: 'wss://continuum-rpc-1.metaverse.network/wss'
    },
    text: 'Continuum',
    ui: {
      color: 'linear-gradient(94deg, #2B388F 2.95%, #DB126E 97.18%)',
      logo: nodesContinuumPNG
    }
  },
  {
    homepage: 'https://crust.network',
    info: 'crustParachain',
    paraId: 2008,
    providers: {
      Crust: 'wss://crust-parachain.crustapps.net'
      // OnFinality: 'wss://crust-polkadot.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/10013
    },
    text: 'Crust',
    ui: {
      logo: nodesCrustParachainSVG
    }
  },
  {
    homepage: 'https://darwinia.network/',
    info: 'darwinia',
    paraId: 2046,
    providers: {
      Darwinia: 'wss://rpc.darwinia.network',
      'Darwinia Community': 'wss://darwinia-rpc.darwiniacommunitydao.xyz',
      Dwellir: 'wss://darwinia-rpc.dwellir.com'
      // OnFinality: 'wss://darwinia2.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9861
    },
    text: 'Darwinia',
    ui: {
      color: '#FF0083',
      logo: nodesDarwiniaSVG
    }
  },
  {
    homepage: 'https://efinity.io',
    info: 'efinity',
    paraId: 2021,
    providers: {
      // NOTE We don't support connections to this parachain at all.
      //
      // 1. The chain is migrated away from the parachain with all balances
      // 2. There is a forked relay-involved which we don't support
      //
      // Additional details in original removal at
      // https://github.com/polkadot-js/apps/pull/9555/files#r1225095086
    },
    text: 'Efinity',
    ui: {
      color: '#496ddb',
      logo: nodesEfinitySVG
    }
  },
  {
    homepage: 'https://energywebx.com/',
    info: 'ewx',
    paraId: 3345,
    providers: {
      'Energy Web': 'wss://public-rpc.mainnet.energywebx.com/'
    },
    text: 'Energy Web X',
    ui: {
      color: '#53B1FF',
      logo: nodesEwxSVG
    }
  },
  {
    homepage: 'https://equilibrium.io/',
    info: 'equilibrium',
    paraId: 2011,
    providers: {
      // Dwellir: 'wss://equilibrium-rpc.dwellir.com'
      // OnFinality: 'wss://equilibrium.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9977
      // Equilibrium: 'wss://node.equilibrium.io' // https://github.com/polkadot-js/apps/issues/10174
    },
    text: 'Equilibrium',
    ui: {
      color: '#1792ff',
      logo: chainsEquilibriumSVG
    }
  },
  {
    homepage: 'https://frequency.xyz',
    info: 'frequency',
    paraId: 2091,
    providers: {
      Dwellir: 'wss://frequency-rpc.dwellir.com',
      'Frequency 0': 'wss://0.rpc.frequency.xyz',
      'Frequency 1': 'wss://1.rpc.frequency.xyz',
      OnFinality: 'wss://frequency-polkadot.api.onfinality.io/public-ws'
    },
    text: 'Frequency',
    ui: {
      color: '#00b6af',
      logo: chainsFrequencySVG
    }
  },
  {
    homepage: 'https://geminis.network/',
    info: 'geminis',
    isUnreachable: true,
    paraId: 2038,
    providers: {
      Geminis: 'wss://rpc.geminis.network'
    },
    text: 'Geminis',
    ui: {
      logo: chainsGeminisPNG
    }
  },
  {
    homepage: 'https://hashed.network/',
    info: 'hashed',
    paraId: 2093,
    providers: {
      'Hashed Systems 1': 'wss://c1.hashed.network',
      'Hashed Systems 2': 'wss://c2.hashed.network',
      'Hashed Systems 3': 'wss://c3.hashed.network'
    },
    text: 'Hashed Network',
    ui: {
      color: '#9199A9',
      logo: nodesHashedPNG
    }
  },
  {
    homepage: 'https://hydradx.io/',
    info: 'hydradx',
    paraId: 2034,
    providers: {
      Dwellir: 'wss://hydradx-rpc.dwellir.com',
      'Galactic Council': 'wss://rpc.hydradx.cloud',
      Helikon: 'wss://rpc.helikon.io/hydradx'
      // OnFinality: 'wss://hydradx.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9986
      // ZeePrime: 'wss://rpc-lb.data6.zp-labs.net:8443/hydradx/ws/?token=2ZGuGivPJJAxXiT1hR1Yg2MXGjMrhEBYFjgbdPi' // https://github.com/polkadot-js/apps/issues/9760
    },
    text: 'HydraDX',
    ui: {
      color: '#f653a2',
      logo: chainsSnakenetSVG
    }
  },
  {
    homepage: 'https://hyperbridge.network',
    info: 'hyperbridge',
    paraId: 3367,
    providers: {
      BlockOps: 'wss://hyperbridge-nexus-rpc.blockops.network'
    },
    text: 'Hyperbridge (Nexus)',
    ui: {
      color: '#ED6FF1',
      logo: nodesHyperbridgeSVG
    }
  },
  {
    homepage: 'https://dot.crowdloan.integritee.network/',
    info: 'integritee',
    paraId: 3359,
    providers: {
      Dwellir: 'wss://integritee-rpc.dwellir.com',
      Integritee: 'wss://polkadot.api.integritee.network'
    },
    text: 'Integritee Network',
    ui: {
      color: '#658ea9',
      logo: nodesIntegriteeSVG
    }
  },
  {
    homepage: 'https://integritee.network',
    info: 'integritee',
    paraId: 2039,
    providers: {
      // Dwellir: 'wss://integritee-rpc.dwellir.com',
      // Integritee: 'wss://polkadot.api.integritee.network'
    },
    text: 'Integritee Network',
    ui: {
      color: '#2e154b',
      logo: nodesIntegriteeSVG
    }
  },
  {
    homepage: 'https://interlay.io/',
    info: 'interlay',
    paraId: 2032,
    providers: {
      Dwellir: 'wss://interlay-rpc.dwellir.com',
      'Kintsugi Labs': 'wss://api.interlay.io/parachain',
      LuckyFriday: 'wss://rpc-interlay.luckyfriday.io/'
      // OnFinality: 'wss://interlay.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9986
    },
    text: 'Interlay',
    ui: {
      color: '#3E96FF',
      logo: nodesInterlaySVG
    }
  },
  {
    homepage: 'https://invarch.network/',
    info: 'invarch',
    paraId: 3340,
    providers: {
      Dwellir: 'wss://invarch-rpc.dwellir.com'
    },
    text: 'InvArch',
    ui: {
      color: 'linear-gradient(278deg, #f7d365 5.74%, #ff408a 99.41%)',
      logo: chainsInvarchJPEG
    }
  },
  {
    homepage: 'https://totemaccounting.com/',
    info: 'kapex',
    paraId: 2007,
    providers: {
      // Dwellir: 'wss://kapex-rpc.dwellir.com'
      // OnFinality: 'wss://kapex-parachain.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9986
      // Totem: 'wss://k-ui.kapex.network' // https://github.com/polkadot-js/apps/issues/9616
    },
    text: 'Kapex',
    ui: {
      color: 'linear-gradient(158deg, rgba(226,157,0,1) 0%, rgba(234,55,203,1) 100%)',
      logo: chainsTotemSVG
    }
  },
  {
    homepage: 'https://www.kilt.io/',
    info: 'kilt',
    paraId: 2086,
    providers: {
      BOTLabs: 'wss://spiritnet.kilt.io/',
      Dwellir: 'wss://kilt-rpc.dwellir.com',
      OnFinality: 'wss://spiritnet.api.onfinality.io/public-ws'
    },
    text: 'KILT Spiritnet',
    ui: {
      color: '#8c145a',
      logo: nodesKiltPNG
    }
  },
  {
    homepage: 'https://kylin.network/',
    info: 'kylin',
    paraId: 2052,
    providers: {
      // 'Kylin Network': 'wss://polkadot.kylin-node.co.uk' // https://github.com/polkadot-js/apps/issues/10030
    },
    text: 'Kylin',
    ui: {
      color: '#ed007e',
      logo: nodesKylinPNG
    }
  },
  {
    homepage: 'https://laosnetwork.io/',
    info: 'laos',
    paraId: 3370,
    providers: {
      // 'freeverse.io': 'wss://rpc.laos.laosfoundation.io'
    },
    text: 'Laos',
    ui: {
      color: 'linear-gradient(90deg, #25143B 0%, #613D93 29.69%, #EF9365 69.79%, #E2CF61 100%)',
      logo: chainsLaosPNG
    }
  },
  {
    homepage: 'https://www.litentry.com/',
    info: 'litentry',
    paraId: 2013,
    providers: {
      Dwellir: 'wss://litentry-rpc.dwellir.com',
      Litentry: 'wss://rpc.litentry-parachain.litentry.io'
      // OnFinality: 'wss://litentry.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9993
    },
    text: 'Litentry',
    ui: {
      color: '#15B786',
      logo: nodesLitentryPNG
    }
  },
  {
    homepage: 'https://logion.network/',
    info: 'logion',
    paraId: 3354,
    providers: {
      'Logion 1': 'wss://para-rpc01.logion.network',
      'Logion 2': 'wss://para-rpc02.logion.network'
    },
    text: 'Logion',
    ui: {
      color: 'rgb(21, 38, 101)',
      logo: chainsLogionPNG
    }
  },
  {
    homepage: 'https://manta.network',
    info: 'manta',
    paraId: 2104,
    providers: {
      'Manta Network': 'wss://ws.manta.systems'
      // OnFinality: 'wss://manta.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9977
    },
    text: 'Manta',
    ui: {
      color: '#2070a6',
      logo: nodesMantaPNG
    }
  },
  {
    homepage: 'https://moonbeam.network/networks/moonbeam/',
    info: 'moonbeam',
    paraId: 2004,
    providers: {
      'Automata 1RPC': 'wss://1rpc.io/glmr',
      Blast: 'wss://moonbeam.public.blastapi.io',
      Dwellir: 'wss://moonbeam-rpc.dwellir.com',
      'Moonbeam Foundation': 'wss://wss.api.moonbeam.network',
      OnFinality: 'wss://moonbeam.api.onfinality.io/public-ws',
      RadiumBlock: 'wss://moonbeam.public.curie.radiumblock.co/ws',
      UnitedBloc: 'wss://moonbeam.unitedbloc.com'
    },
    text: 'Moonbeam',
    ui: {
      color: '#53cbc9',
      logo: nodesMoonbeamSVG
    }
  },
  {
    homepage: 'https://moonsama.com',
    info: 'moonsama',
    paraId: 3334,
    providers: {
      // Moonsama: 'wss://rpc.moonsama.com/ws' // https://github.com/polkadot-js/apps/issues/10289
    },
    text: 'Moonsama',
    ui: {
      color: '#1a202c',
      logo: nodesMoonsamaSVG
    }
  },
  {
    homepage: 'https://mythos.foundation/',
    info: 'mythos',
    paraId: 3369,
    providers: {
      parity: 'wss://polkadot-mythos-rpc.polkadot.io'
    },
    text: 'Mythos',
    ui: {
      color: '#262528',
      logo: nodesMythosPNG
    }
  },
  {
    homepage: 'https://neuroweb.ai',
    info: 'neuroweb',
    paraId: 2043,
    providers: {
      Dwellir: 'wss://origintrail-rpc.dwellir.com',
      TraceLabs: 'wss://parachain-rpc.origin-trail.network'
    },
    text: 'NeuroWeb',
    ui: {
      color: '#000000',
      logo: chainsNeurowebPNG
    }
  },
  {
    homepage: 'https://nodle.com',
    info: 'nodle',
    paraId: 2026,
    providers: {
      Dwellir: 'wss://nodle-rpc.dwellir.com',
      OnFinality: 'wss://nodle-parachain.api.onfinality.io/public-ws'
    },
    text: 'Nodle',
    ui: {
      color: '#1ab394',
      logo: nodesNodleSVG
    }
  },
  {
    homepage: 'https://oak.tech',
    info: 'oak',
    isUnreachable: true,
    paraId: 2090,
    providers: {
      OAK: 'wss://rpc.oak.tech'
    },
    text: 'OAK Network',
    ui: {
      color: '#A8278C',
      logo: chainsOakPNG
    }
  },
  {
    homepage: 'https://www.omnibtc.finance',
    info: 'omnibtc',
    isUnreachable: true,
    paraId: 2053,
    providers: {
      OmniBTC: 'wss://psc-parachain.coming.chat'
    },
    text: 'OmniBTC',
    ui: {
      color: '#6759E9',
      logo: nodesOmnibtcSVG
    }
  },
  {
    homepage: 'https://parallel.fi',
    info: 'parallel',
    paraId: 2012,
    providers: {
      Dwellir: 'wss://parallel-rpc.dwellir.com'
      // OnFinality: 'wss://parallel.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/9986
      // Parallel: 'wss://polkadot-parallel-rpc.parallel.fi' // https://github.com/polkadot-js/apps/issues/10220
    },
    text: 'Parallel',
    ui: {
      color: '#ef18ac',
      logo: nodesParallelSVG
    }
  },
  {
    homepage: 'https://peaq.network/',
    info: 'peaq',
    paraId: 3338,
    providers: {},
    text: 'peaq',
    ui: {
      logo: chainsPeaqPNG
    }
  },
  {
    homepage: 'https://pendulumchain.org/',
    info: 'pendulum',
    paraId: 2094,
    providers: {
      // Dwellir: 'wss://pendulum-rpc.dwellir.com',
      PendulumChain: 'wss://rpc-pendulum.prd.pendulumchain.tech'
    },
    text: 'Pendulum',
    ui: {
      color: '#49E2FD',
      logo: chainsPendulumSVG
    }
  },
  {
    homepage: 'https://phala.network',
    info: 'phala',
    paraId: 2035,
    providers: {
      Dwellir: 'wss://phala-rpc.dwellir.com',
      Helikon: 'wss://rpc.helikon.io/phala',
      OnFinality: 'wss://phala.api.onfinality.io/public-ws',
      Phala: 'wss://api.phala.network/ws',
      RadiumBlock: 'wss://phala.public.curie.radiumblock.co/ws',
      Rockx: 'wss://rockx-phala.w3node.com/polka-public-phala/ws'
    },
    text: 'Phala Network',
    ui: {
      color: '#c6fa4c',
      logo: nodesPhalaSVG
    }
  },
  {
    homepage: 'https://www.polimec.org/',
    info: 'polimec',
    paraId: 3344,
    providers: {
      Amforc: 'wss://polimec.rpc.amforc.com',
      Helikon: 'wss://rpc.helikon.io/polimec',
      'Polimec Foundation': 'wss://rpc.polimec.org'
    },
    text: 'Polimec',
    ui: {
      color: '#25311C',
      logo: nodesPolimecSVG
    }
  },
  {
    homepage: 'https://polkadex.trade/crowdloans',
    info: 'polkadex',
    paraId: 3363,
    providers: {
      // Dwellir: 'wss://polkadex-parachain-rpc.dwellir.com',
      // OnFinality: 'wss://polkadex-parachain.api.onfinality.io/public-ws',
      // RadiumBlock: 'wss://polkadex-parachain.public.curie.radiumblock.co/ws'
    },
    text: 'Polkadex',
    ui: {
      color: '#7C30DD',
      logo: nodesPolkadexSVG
    }
  },
  {
    homepage: 'https://polkadex.trade/',
    info: 'polkadex',
    paraId: 2040,
    providers: {
      Dwellir: 'wss://polkadex-parachain-rpc.dwellir.com',
      OnFinality: 'wss://polkadex-parachain.api.onfinality.io/public-ws',
      RadiumBlock: 'wss://polkadex-parachain.public.curie.radiumblock.co/ws'
    },
    text: 'Polkadex',
    ui: {
      color: '#7C30DD',
      logo: nodesPolkadexSVG
    }
  },
  {
    homepage: 'https://sora.org/',
    info: 'sora',
    paraId: 2025,
    providers: {
      Soramitsu: 'wss://ws.parachain-collator-3.pc3.sora2.soramitsu.co.jp'
    },
    text: 'SORA',
    ui: {
      color: '#2D2926',
      logo: nodesSoraSubstrateSVG
    }
  },
  {
    homepage: 'https://subdao.network/',
    info: 'subdao',
    isUnreachable: true,
    paraId: 2018,
    providers: {
      SubDAO: 'wss://parachain-rpc.subdao.org'
    },
    text: 'SubDAO',
    ui: {
      color: 'linear-gradient(50deg, #F20092 0%, #FF4D5D 100%)',
      logo: nodesSubdaoPNG
    }
  },
  {
    homepage: 'http://subgame.org/',
    info: 'subgame',
    paraId: 2017,
    providers: {
      // SubGame: 'wss://gamma.subgame.org/' // https://github.com/polkadot-js/apps/pull/6761
    },
    text: 'SubGame Gamma',
    ui: {
      color: '#EB027D',
      logo: nodesSubgameSVG
    }
  },
  {
    homepage: 'https://subsocial.network/',
    info: 'subsocial',
    paraId: 2101,
    providers: {
      Dappforce: 'wss://para.subsocial.network',
      Dwellir: 'wss://subsocial-rpc.dwellir.com'
      // OnFinality: 'wss://subsocial-polkadot.api.onfinality.io/public-ws' // https://github.com/polkadot-js/apps/issues/9977
    },
    text: 'Subsocial',
    ui: {
      color: '#b9018c',
      logo: nodesSubsocialSVG
    }
  },
  {
    homepage: 'https://www.t3rn.io/',
    info: 't3rn',
    paraId: 3333,
    providers: {
      t3rn: 'wss://ws.t3rn.io'
    },
    text: 't3rn',
    ui: {
      color: '#6f3bb2',
      logo: nodesT3rnPNG
    }
  },
  {
    homepage: 'https://unique.network/',
    info: 'unique',
    paraId: 2037,
    providers: {
      Dwellir: 'wss://unique-rpc.dwellir.com',
      'Geo Load Balancer': 'wss://ws.unique.network',
      // OnFinality: 'wss://unique.api.onfinality.io/public-ws', // https://github.com/polkadot-js/apps/issues/10030
      'Unique America': 'wss://us-ws.unique.network',
      'Unique Asia': 'wss://asia-ws.unique.network',
      'Unique Europe': 'wss://eu-ws.unique.network'
    },
    text: 'Unique Network',
    ui: {
      color: '#40BCFF',
      logo: nodesUniqueSVG
    }
  },
  {
    homepage: 'https://www.watr.org/',
    info: 'watr',
    paraId: 2058,
    providers: {
      RadiumBlock: 'wss://watr.public.curie.radiumblock.co/ws',
      Watr: 'wss://watr-rpc.watr-api.network'
    },
    text: 'Watr Network',
    ui: {
      color: '#373b39',
      logo: chainsWatrPNG
    }
  },
  {
    homepage: 'https://zeitgeist.pm',
    info: 'zeitgeist',
    paraId: 2092,
    providers: {
      Dwellir: 'wss://zeitgeist-rpc.dwellir.com',
      OnFinality: 'wss://zeitgeist.api.onfinality.io/public-ws',
      ZeitgeistPM: 'wss://main.rpc.zeitgeist.pm/ws'
    },
    text: 'Zeitgeist',
    ui: {
      color: 'linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)',
      logo: nodesZeitgeistPNG
    }
  }
];

export const prodParasPolkadotCommon: EndpointOption[] = [
  {
    info: 'PolkadotAssetHub',
    paraId: 1000,
    providers: {
      Dwellir: 'wss://statemint-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://statemint-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://sys.ibp.network/statemint',
      'IBP-GeoDNS2': 'wss://sys.dotters.network/statemint',
      LuckyFriday: 'wss://rpc-asset-hub-polkadot.luckyfriday.io',
      OnFinality: 'wss://statemint.api.onfinality.io/public-ws',
      Parity: 'wss://polkadot-asset-hub-rpc.polkadot.io',
      RadiumBlock: 'wss://statemint.public.curie.radiumblock.co/ws',
      Stakeworld: 'wss://dot-rpc.stakeworld.io/assethub'
    },
    teleport: [-1],
    text: 'AssetHub',
    ui: {
      color: '#86e62a',
      logo: nodesAssetHubSVG
    }
  },
  {
    info: 'polkadotBridgeHub',
    paraId: 1002,
    providers: {
      Dwellir: 'wss://polkadot-bridge-hub-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://polkadot-bridge-hub-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://sys.ibp.network/bridgehub-polkadot',
      'IBP-GeoDNS2': 'wss://sys.dotters.network/bridgehub-polkadot',
      LuckyFriday: 'wss://rpc-bridge-hub-polkadot.luckyfriday.io',
      OnFinality: 'wss://bridgehub-polkadot.api.onfinality.io/public-ws',
      Parity: 'wss://polkadot-bridge-hub-rpc.polkadot.io',
      RadiumBlock: 'wss://bridgehub-polkadot.public.curie.radiumblock.co/ws',
      Stakeworld: 'wss://dot-rpc.stakeworld.io/bridgehub'
    },
    teleport: [-1],
    text: 'BridgeHub',
    ui: {
      logo: nodesBridgeHubSVG
    }
  },
  {
    info: 'polkadotCollectives',
    paraId: 1001,
    providers: {
      Dwellir: 'wss://polkadot-collectives-rpc.dwellir.com',
      'Dwellir Tunisia': 'wss://polkadot-collectives-rpc-tn.dwellir.com',
      'IBP-GeoDNS1': 'wss://sys.ibp.network/collectives-polkadot',
      'IBP-GeoDNS2': 'wss://sys.dotters.network/collectives-polkadot',
      LuckyFriday: 'wss://rpc-collectives-polkadot.luckyfriday.io',
      OnFinality: 'wss://collectives.api.onfinality.io/public-ws',
      Parity: 'wss://polkadot-collectives-rpc.polkadot.io',
      RadiumBlock: 'wss://collectives.public.curie.radiumblock.co/ws',
      Stakeworld: 'wss://dot-rpc.stakeworld.io/collectives'
    },
    teleport: [-1],
    text: 'Collectives',
    ui: {
      color: '#e6777a',
      logo: 'fa;people-group'
    }
  }
];

export const prodRelayPolkadot: EndpointOption = {
  dnslink: 'polkadot',
  genesisHash: POLKADOT_GENESIS,
  info: 'polkadot',
  linked: [
    ...prodParasPolkadotCommon,
    ...prodParasPolkadot
  ],
  providers: {
    // 'Geometry Labs': 'wss://polkadot.geometry.io/websockets', // https://github.com/polkadot-js/apps/pull/6746
    // 'Automata 1RPC': 'wss://1rpc.io/dot',
    Blockops: 'wss://polkadot-public-rpc.blockops.network/ws', // https://github.com/polkadot-js/apps/issues/9840
    Dwellir: 'wss://polkadot-rpc.dwellir.com',
    'Dwellir Tunisia': 'wss://polkadot-rpc-tn.dwellir.com',
    'IBP-GeoDNS1': 'wss://rpc.ibp.network/polkadot',
    'IBP-GeoDNS2': 'wss://rpc.dotters.network/polkadot',
    LuckyFriday: 'wss://rpc-polkadot.luckyfriday.io',
    OnFinality: 'wss://polkadot.api.onfinality.io/public-ws',
    RadiumBlock: 'wss://polkadot.public.curie.radiumblock.co/ws',
    RockX: 'wss://rockx-dot.w3node.com/polka-public-dot/ws',
    Stakeworld: 'wss://dot-rpc.stakeworld.io',
    'light client': 'light://substrate-connect/polkadot'
  },
  teleport: getTeleports(prodParasPolkadotCommon),
  text: 'Polkadot',
  ui: {
    color: '#e6007a',
    identityIcon: 'polkadot',
    logo: chainsPolkadotCircleSVG
  }
};
