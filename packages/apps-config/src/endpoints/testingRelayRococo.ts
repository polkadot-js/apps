// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { ROCOCO_GENESIS } from '../api/constants.js';
import { chainsAcurastPNG, chainsAmplitudeSVG, chainsBitgreenPNG, chainsFrequencySVG, chainsGenshiroSVG, chainsHydratePNG, chainsIdiyanaleLogoWhiteSVG, chainsJurPNG, chainsMangataPNG, chainsMoonsamaPNG, chainsOrigintrailTestnetPNG, chainsRococoSVG, chainsSnowbridgePNG, chainsT0rnPNG, chainsTanglePNG, chainsTinkerPNG, chainsTotemSVG, chainsTuringPNG, chainsVirtoPNG, chainsWatrPNG } from '../ui/logos/chains/index.js';
import { nodesArcticPNG, nodesAventusSVG, nodesBajunPNG, nodesBasiliskPNG, nodesBasiliskRococoBgPNG, nodesBifrostSVG, nodesBridgeHubBlackSVG, nodesCentrifugePNG, nodesConftiSVG, nodesCrustParachainSVG, nodesDatahighwayPNG, nodesDolphinSVG, nodesEncointerBlueSVG, nodesGiantPNG, nodesHelixstreetPNG, nodesImbuePNG, nodesIntegriteeSVG, nodesKabochaSVG, nodesKiltPNG, nodesLitentryRococoPNG, nodesMd5PNG, nodesNodleSVG, nodesOliSVG, nodesPangolinSVG, nodesPhalaSVG, nodesPicassoPNG, nodesPolkadexSVG, nodesRobonomicsSVG, nodesRocfinitySVG, nodesSocietalSVG, nodesSoonsocialXPNG, nodesSoraSubstrateSVG, nodesStatemineSVG, nodesSubstrateContractsNodePNG, nodesUnitnetworkPNG, nodesZeitgeistPNG, nodesZeroSVG } from '../ui/logos/nodes/index.js';
import { getTeleports } from './util.js';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const testParasRococo: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'rococoAcurast',
    paraId: 4191,
    providers: {
      // Acurast: 'wss://ws.acurast-rococo.diamond.papers.tech' // https://github.com/polkadot-js/apps/issues/9321
    },
    text: 'Acurast Testnet',
    ui: {
      color: '#000000',
      logo: chainsAcurastPNG
    }
  },
  {
    info: 'rococoAmplitude',
    paraId: 2124,
    providers: {
      PendulumChain: 'wss://rpc-foucoco.pendulumchain.tech'
    },
    text: 'Amplitude testnet (Foucoco)',
    ui: {
      color: '#5DEFA7',
      logo: chainsAmplitudeSVG
    }
  },
  {
    info: 'arctic',
    paraId: 3015,
    providers: {
      // Arctic: 'wss://arctic-rococo-rpc.icenetwork.io' // https://github.com/polkadot-js/apps/issues/9224
    },
    text: 'Arctic',
    ui: {
      logo: nodesArcticPNG
    }
  },
  {
    homepage: 'https://www.aventus.io/',
    info: 'rococoAventus',
    paraId: 2056,
    providers: {
      Aventus: 'wss://public-rpc.public-testnet.aventus.io'
    },
    text: 'Aventus',
    ui: {
      color: '#E6E6FA',
      logo: nodesAventusSVG
    }
  },
  {
    info: 'rococoBajun',
    paraId: 2119,
    providers: {
      AjunaNetwork: 'wss://rpc-rococo.bajun.network'
    },
    text: 'Bajun Network',
    ui: {
      color: '#161212',
      logo: nodesBajunPNG
    }
  },
  {
    info: 'rococoBasilisk',
    paraId: 2090,
    providers: {
      'Galactic Council': 'wss://basilisk-rococo-rpc.play.hydration.cloud'
    },
    text: 'Basilisk',
    ui: {
      color: `url(${nodesBasiliskRococoBgPNG}) #000`,
      logo: nodesBasiliskPNG
    }
  },
  {
    info: 'rococoBifrost',
    paraId: 2030,
    providers: {
      Liebi: 'wss://bifrost-rpc.rococo.liebi.com/ws'
    },
    text: 'Bifrost',
    ui: {
      color: '#5a25f0',
      logo: nodesBifrostSVG
    }
  },
  {
    info: 'rococoBitgreen',
    paraId: 20048,
    providers: {
      // Bitgreen: 'wss://staging.bitgreen.org' // https://github.com/polkadot-js/apps/issues/9369
    },
    text: 'Bitgreen',
    ui: {
      color: '#224851',
      logo: chainsBitgreenPNG
    }
  },
  {
    info: 'rococoCatalyst',
    paraId: 2031,
    providers: {
      Centrifuge: 'wss://fullnode.catalyst.cntrfg.com'
    },
    text: 'Catalyst',
    ui: {
      logo: nodesCentrifugePNG
    }
  },
  {
    info: 'rococoConfti',
    paraId: 4094,
    providers: {
      // Confti: 'wss://ws.confti.club' // https://github.com/polkadot-js/apps/issues/8036
    },
    text: 'Confti',
    ui: {
      logo: nodesConftiSVG
    }
  },
  {
    info: 'rococoCrust',
    paraId: 2012,
    providers: {
      // Crust: 'wss://rococo-csm.crustcode.com/' // https://github.com/polkadot-js/apps/issues/9025
    },
    text: 'Crust Testnet',
    ui: {
      logo: nodesCrustParachainSVG
    }
  },
  {
    info: 'rococoDolphin',
    paraId: 2084,
    providers: {
      // 'Manta Network': 'wss://ws.rococo.dolphin.engineering' // https://github.com/polkadot-js/apps/issues/9071
    },
    text: 'Dolphin',
    ui: {
      logo: nodesDolphinSVG
    }
  },
  {
    info: 'rococoEthos',
    paraId: 2095,
    providers: {
      Jur: 'wss://ethos.jur.io'
    },
    text: 'Ethos',
    ui: {
      color: '#203050',
      logo: chainsJurPNG
    }
  },
  {
    info: 'rococoFrequency',
    paraId: 4044,
    providers: {
      Dwellir: 'wss://frequency-rococo-rpc.dwellir.com',
      Frequency: 'wss://rpc.rococo.frequency.xyz'
    },
    text: 'Frequency',
    ui: {
      color: '#29fd47',
      logo: chainsFrequencySVG
    }
  },
  {
    info: 'rococoGenshiro',
    paraId: 2024,
    providers: {
      // Equilibrium: 'wss://parachain-testnet.equilab.io/rococo/collator/node1/wss' // https://github.com/polkadot-js/apps/issues/9059
    },
    text: 'Genshiro Testnet',
    ui: {
      color: '#e8662d',
      logo: chainsGenshiroSVG
    }
  },
  {
    info: 'giantTestnet',
    paraId: 4227,
    providers: {
      // GIANT: 'wss://rpc-1-us-east-1-testnetrococo.giantprotocol.org' // https://github.com/polkadot-js/apps/issues/9261
    },
    text: 'GIANT Protocol',
    ui: {
      color: '#45B549',
      logo: nodesGiantPNG
    }
  },
  {
    info: 'helixstreet',
    paraId: 3025,
    providers: {
      // Helixstreet: 'wss://rpc-rococo.helixstreet.io' // https://github.com/polkadot-js/apps/issues/9296
    },
    text: 'Helixstreet',
    ui: {
      logo: nodesHelixstreetPNG
    }
  },
  {
    info: 'rococoHydraDX',
    paraId: 2034,
    providers: {
      'Galactic Council': 'wss://rococo-hydradx-rpc.hydration.dev'
    },
    text: 'HydraDX',
    ui: {
      color: '#f653a2',
      logo: chainsHydratePNG
    }
  },
  {
    info: 'rococoIdiyanale',
    paraId: 4222,
    providers: {
      // 'Anagolay Network': 'wss://rococo.rpc.idiyanale.anagolay.io' // https://github.com/polkadot-js/apps/issues/9292
    },
    text: 'Idiyanale Network',
    ui: {
      color: 'linear-gradient(90deg, #23ACF6 0%, #6FD606 100%)',
      logo: chainsIdiyanaleLogoWhiteSVG
    }
  },
  {
    info: 'rococoImbue',
    paraId: 2121,
    providers: {
      // 'Imbue Network': 'wss://rococo.imbue.network' // https://github.com/polkadot-js/apps/issues/9075
    },
    text: 'Imbue Network',
    ui: {
      color: '#baff36',
      logo: nodesImbuePNG
    }
  },
  {
    info: 'rococoIntegritee',
    paraId: 3002,
    providers: {
      Integritee: 'wss://rococo.api.integritee.network'
    },
    text: 'Integritee Network',
    ui: {
      color: '#658ea9',
      logo: nodesIntegriteeSVG
    }
  },
  {
    info: 'rococoKabocha',
    paraId: 2113,
    providers: {
      // JelliedOwl: 'wss://kabsoup1.jelliedowl.com' // https://github.com/polkadot-js/apps/issues/9059
    },
    text: 'Kabocha (kabsoup)',
    ui: {
      color: 'repeating-radial-gradient(black, black 4px, yellow 5px)',
      logo: nodesKabochaSVG
    }
  },
  {
    homepage: 'https://polkadex.trade',
    info: 'rococoKaizen',
    paraId: 2040,
    providers: {
      // 'Polkadex Team': 'wss://kaizen-parachain.polkadex.trade' // https://github.com/polkadot-js/apps/issues/9059
    },
    text: 'Kaizen',
    ui: {
      color: '#7C30DD',
      logo: nodesPolkadexSVG
    }
  },
  {
    homepage: 'https://www.litentry.com/',
    info: 'rococoLitentry',
    paraId: 2106,
    providers: {
      Litentry: 'wss://rpc.rococo-parachain-sg.litentry.io'
    },
    text: 'Litentry',
    ui: {
      color: '#ECDA38',
      logo: nodesLitentryRococoPNG
    }
  },
  {
    info: 'rococoMangata',
    paraId: 2110,
    providers: {
      Mangata: 'wss://collator-01-ws-rococo.mangata.online'
    },
    text: 'Mangata',
    ui: {
      color: '#030408',
      logo: chainsMangataPNG
    }
  },
  {
    info: 'rococoMd5',
    paraId: 2093,
    providers: {
      'Hashed Systems': 'wss://c1.md5.hashed.live'
    },
    text: 'MD5 Network',
    ui: {
      color: '#175bae',
      logo: nodesMd5PNG
    }
  },
  {
    info: 'rococoMoonsama',
    paraId: 2055,
    providers: {
      // Moonsama: 'wss://moonsama-testnet-rpc.moonsama.com' // https://github.com/polkadot-js/apps/issues/7526
    },
    text: 'Moonsama',
    ui: {
      color: '#000000',
      logo: chainsMoonsamaPNG
    }
  },
  {
    info: 'rococoNodle',
    paraId: 2026,
    providers: {
      OnFinality: 'wss://nodle-paradis.api.onfinality.io/public-ws'
    },
    text: 'Nodle',
    ui: {
      color: '#1ab394',
      logo: nodesNodleSVG
    }
  },
  {
    homepage: 'https://www.my-oli.com/en/',
    info: 'chainoli',
    paraId: 4023,
    providers: {},
    text: 'OLI',
    ui: {
      color: '#8CC63F',
      logo: nodesOliSVG
    }
  },
  {
    homepage: 'https://parachain.origintrail.io',
    info: 'rococoOriginTrailParachain',
    paraId: 2043,
    providers: {
      TraceLabs: 'wss://parachain-testnet-rpc.origin-trail.network/'
    },
    text: 'OriginTrail Testnet',
    ui: {
      color: '#0C0C0C',
      logo: chainsOrigintrailTestnetPNG
    }
  },
  {
    info: 'rococoPangolin',
    paraId: 2105,
    providers: {
      'Darwinia Network': 'wss://pangolin-rpc.darwinia.network'
    },
    text: 'Pangolin2',
    ui: {
      color: '#4B30DD',
      logo: nodesPangolinSVG
    }
  },
  {
    info: 'rococoPicasso',
    paraId: 2087,
    providers: {
      Composable: 'wss://picasso-rococo-rpc-lb.composablenodes.tech'
    },
    text: 'Picasso Testnet',
    ui: {
      color: '#000000',
      logo: nodesPicassoPNG
    }
  },
  {
    info: 'rococoPhala',
    paraId: 2004,
    providers: {
      'Phala Network': 'wss://rhala-node.phala.network/ws'
    },
    text: 'Rhala Testnet',
    ui: {
      logo: nodesPhalaSVG
    }
  },
  {
    info: 'rococoKilt',
    paraId: 2086,
    providers: {
      // 'KILT Protocol': 'wss://rococo.kilt.io' // https://github.com/polkadot-js/apps/issues/9338
    },
    text: 'RILT',
    ui: {
      color: 'linear-gradient(45deg, #8c145a 0%, #f05a27 100%)',
      logo: nodesKiltPNG
    }
  },
  {
    homepage: 'http://robonomics.network/',
    info: 'robonomics',
    paraId: 2048,
    providers: {
      // Airalab: 'wss://rococo.rpc.robonomics.network' // https://github.com/polkadot-js/apps/issues/9319
    },
    text: 'Robonomics',
    ui: {
      color: '#2949d3',
      logo: nodesRobonomicsSVG
    }
  },
  {
    info: 'rocfinity',
    paraId: 2021,
    providers: {
      // Efinity: 'wss://rpc.rococo.efinity.io' // https://github.com/polkadot-js/apps/issues/9059
    },
    text: 'Rocfinity',
    ui: {
      color: '#496ddb',
      logo: nodesRocfinitySVG
    }
  },
  {
    info: 'snowbridge',
    paraId: 3016,
    providers: {
      // Snowfork: 'wss://rococo-rpc.snowbridge.network' // https://github.com/polkadot-js/apps/issues/8723
    },
    text: 'Snowbridge',
    ui: {
      logo: chainsSnowbridgePNG
    }
  },
  {
    info: 'rococoSocietal',
    paraId: 4253,
    providers: {
      Societal: 'wss://node-ws-rococo.testnet.sctl.link'
    },
    text: 'Societal',
    ui: {
      color: '#501254',
      logo: nodesSocietalSVG
    }
  },
  {
    info: 'rococoSubsocial',
    paraId: 2100,
    providers: {
      DappForce: 'wss://rco-para.subsocial.network'
    },
    text: 'SoonsocialX',
    ui: {
      color: '#b9018c',
      logo: nodesSoonsocialXPNG
    }
  },
  {
    info: 'rococoSora',
    paraId: 2011,
    providers: {
      Soramitsu: 'wss://ws.parachain-collator-1.c1.stg1.sora2.soramitsu.co.jp'
    },
    text: 'SORA',
    ui: {
      color: '#2D2926',
      logo: nodesSoraSubstrateSVG
    }
  },
  {
    info: 'rococoSpreehafen',
    paraId: 2116,
    providers: {
      DataHighway: 'wss://spreehafen.datahighway.com'
    },
    text: 'Spreehafen',
    ui: {
      color: 'linear-gradient(-90deg, #9400D3 0%, #5A5CA9 50%, #00BFFF 100%)',
      logo: nodesDatahighwayPNG
    }
  },
  {
    homepage: 'https://totemaccounting.com/',
    info: 'stagex',
    paraId: 2007,
    providers: {
      // Totem: 'wss://s-ui.kapex.network' // https://github.com/polkadot-js/apps/issues/9286
    },
    text: 'Stagex',
    ui: {
      color: 'linear-gradient(158deg, rgba(226,157,0,1) 0%, rgba(234,55,203,1) 100%)',
      logo: chainsTotemSVG
    }
  },
  {
    info: 'rococoSubzero',
    paraId: 4040,
    providers: {
      // ZERO: 'wss://staging.para.sub.zero.io' // https://github.com/polkadot-js/apps/issues/9522
    },
    text: 'Subzero',
    ui: {
      logo: nodesZeroSVG
    }
  },
  {
    info: 't0rn',
    paraId: 3333,
    providers: {
      t3rn: 'wss://ws.t0rn.io'
    },
    text: 't0rn',
    ui: {
      color: '#212322',
      logo: chainsT0rnPNG
    }
  },
  {
    info: 'tangle',
    paraId: 4006,
    providers: {
      // Webb: 'wss://tangle-rococo-archive.webb.tools' // https://github.com/polkadot-js/apps/issues/9069
    },
    text: 'Tangle',
    ui: {
      color: '#483d8b',
      logo: chainsTanglePNG
    }
  },
  {
    info: 'rococoTinkernet',
    paraId: 2125,
    providers: {
      // 'InvArch Team': 'wss://rococo.invarch.network' // https://github.com/polkadot-js/apps/issues/8266
    },
    text: 'Tinkernet',
    ui: {
      color: 'linear-gradient(90deg, rgba(253,52,166,1) 0%, rgba(22,213,239,1) 100%)',
      logo: chainsTinkerPNG
    }
  },
  {
    info: 'rococoTuring',
    paraId: 2114,
    providers: {
      OAK: 'wss://rpc.turing-staging.oak.tech'
    },
    text: 'Turing Network (Staging)',
    ui: {
      color: '#A8278C',
      logo: chainsTuringPNG
    }
  },
  {
    info: 'rococoUnitNetwork',
    paraId: 4168,
    providers: {
      UnitNetwork: 'wss://www.unitnode3.info:443'
    },
    text: 'Unit Network',
    ui: {
      color: '#a351ef',
      logo: nodesUnitnetworkPNG
    }
  },
  {
    info: 'rococoVirto',
    paraId: 3003,
    providers: {
      // VirtoNetwork: 'wss://rococo.virtonetwork.xyz' // https://github.com/polkadot-js/apps/issues/8024
    },
    text: 'Virto',
    ui: {
      color: '#063970',
      logo: chainsVirtoPNG
    }
  },
  {
    info: 'rococoWatr',
    paraId: 2058,
    providers: {
      Watr: 'wss://rpc.dev.watr.org'
    },
    text: 'Watr Network',
    ui: {
      color: '#373b39',
      logo: chainsWatrPNG
    }
  },
  {
    info: 'rococoZeitgeist',
    paraId: 2101,
    providers: {
      Zeitgeist: 'wss://bsr.zeitgeist.pm'
    },
    text: 'Zeitgeist Battery Station',
    ui: {
      color: 'linear-gradient(180deg, rgba(32,90,172,1) 0%, rgba(26,72,138,1) 50%, rgba(13,36,69,1) 100%)',
      logo: nodesZeitgeistPNG
    }
  }
];

export const testParasRococoCommon: EndpointOption[] = [
  {
    info: 'rococoStatemint',
    paraId: 1000,
    providers: {
      Parity: 'wss://rococo-rockmine-rpc.polkadot.io'
    },
    teleport: [-1],
    text: 'Rockmine',
    ui: {
      color: '#77bb77',
      logo: nodesStatemineSVG
    }
  },
  {
    info: 'rococoContracts',
    paraId: 1002,
    providers: {
      Parity: 'wss://rococo-contracts-rpc.polkadot.io'
    },
    teleport: [-1],
    text: 'Contracts',
    ui: {
      color: '#000000',
      logo: nodesSubstrateContractsNodePNG
    }
  },
  {
    homepage: 'https://encointer.org/',
    info: 'encointer',
    paraId: 1003,
    providers: {
      'Encointer Association': 'wss://rococo.api.encointer.org'
    },
    teleport: [-1],
    text: 'Encointer Lietaer',
    ui: {
      color: '#0000cc',
      logo: nodesEncointerBlueSVG
    }
  },
  {
    info: 'rococoBridgehub',
    paraId: 1013,
    providers: {
      Parity: 'wss://rococo-bridge-hub-rpc.polkadot.io'
    },
    teleport: [-1],
    text: 'Bridgehub',
    ui: {
      logo: nodesBridgeHubBlackSVG
    }
  }
];

export const testRelayRococo: EndpointOption = {
  dnslink: 'rococo',
  genesisHash: ROCOCO_GENESIS,
  info: 'rococo',
  linked: [
    ...testParasRococoCommon,
    ...testParasRococo
  ],
  providers: {
    Parity: 'wss://rococo-rpc.polkadot.io',
    // 'Ares Protocol': 'wss://rococo.aresprotocol.com' // https://github.com/polkadot-js/apps/issues/5767
    'light client': 'light://substrate-connect/rococo'
  },
  teleport: getTeleports(testParasRococoCommon),
  text: 'Rococo',
  ui: {
    color: '#6f36dc',
    logo: chainsRococoSVG
  }
};
