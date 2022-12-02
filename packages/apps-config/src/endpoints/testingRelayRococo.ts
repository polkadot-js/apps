// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from '../types';
import type { EndpointOption } from './types';

import { ROCOCO_GENESIS } from '../api/constants';
import { getTeleports } from './util';

/* eslint-disable sort-keys */

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   providers: The actual hosted secure websocket endpoint
//
// IMPORTANT: Alphabetical based on text
export const testParasRococo: EndpointOption[] = [
  {
    info: 'rococoAmplitude',
    paraId: 2124,
    text: 'Amplitude testnet (Foucoco)',
    providers: {
      PendulumChain: 'wss://rpc-foucoco.pendulumchain.tech'
    }
  },
  {
    info: 'arctic',
    paraId: 3015,
    text: 'Arctic',
    providers: {
      Arctic: 'wss://arctic-rococo-rpc.icenetwork.io'
    }
  },
  {
    info: 'rococoAventus',
    homepage: 'https://www.aventus.io/',
    paraId: 2056,
    text: 'Aventus',
    providers: { }
  },
  {
    info: 'rococoBajun',
    paraId: 2119,
    text: 'Bajun Network',
    providers: {
      AjunaNetwork: 'wss://rpc-rococo.bajun.network'
    }
  },
  {
    info: 'rococoBasilisk',
    paraId: 2090,
    text: 'Basilisk',
    providers: {
      'Galactic Council': 'wss://rococo-basilisk-rpc.hydration.dev'
    }
  },
  {
    info: 'rococoBifrost',
    paraId: 2030,
    text: 'Bifrost',
    providers: {
      Liebi: 'wss://bifrost-rpc.rococo.liebi.com/ws'
    }
  },
  {
    info: 'rococoBitgreen',
    paraId: 3024,
    text: 'Bitgreen',
    providers: {
      Bitgreen: 'wss://testnet.bitgreen.org'
    }
  },
  {
    info: 'rococoCatalyst',
    paraId: 2031,
    text: 'Catalyst',
    providers: {
      Centrifuge: 'wss://fullnode.catalyst.cntrfg.com'
    }
  },
  {
    info: 'rococoConfti',
    paraId: 4094,
    text: 'Confti',
    providers: {
      // Confti: 'wss://ws.confti.club' // https://github.com/polkadot-js/apps/issues/8036
    }
  },
  {
    info: 'rococoCrust',
    paraId: 2012,
    text: 'Crust Testnet',
    providers: {
      Crust: 'wss://rococo-csm.crustcode.com/'
    }
  },
  {
    info: 'rococoDali',
    paraId: 2087,
    text: 'Dali',
    providers: {
      Composable: 'wss://rpc.composablefinance.ninja'
    }
  },
  {
    info: 'rococoDolphin',
    paraId: 2084,
    text: 'Dolphin',
    providers: {
      'Manta Network': 'wss://ws.rococo.dolphin.engineering'
    }
  },
  {
    info: 'Eggnet',
    paraId: 4006,
    text: 'Eggnet',
    providers: {
      // Webb: 'wss://rococo1.webb.tools' // https://github.com/polkadot-js/apps/issues/8175
    }
  },
  {
    info: 'rococoFrequency',
    paraId: 4044,
    text: 'Frequency',
    providers: {
      Frequency: 'wss://rpc.rococo.frequency.xyz'
    }
  },
  {
    info: 'rococoGenshiro',
    paraId: 2024,
    text: 'Genshiro Testnet',
    providers: {
      Equilibrium: 'wss://parachain-testnet.equilab.io/rococo/collator/node1/wss'
    }
  },
  {
    info: 'helixstreet',
    paraId: 3025,
    text: 'Helixstreet',
    providers: {
      Helixstreet: 'wss://rpc-rococo.helixstreet.io'
    }
  },
  {
    info: 'rococoHydraDX',
    paraId: 2034,
    text: 'HydraDX',
    providers: {
      'Galactic Council': 'wss://rococo-hydradx-rpc.hydration.dev'
    }
  },
  {
    info: 'rococoImbue',
    paraId: 2121,
    text: 'Imbue Network',
    providers: {
      'Imbue Network': 'wss://rococo.imbue.network'
    }
  },
  {
    info: 'rococoIntegritee',
    paraId: 3002,
    text: 'Integritee Network',
    providers: {
      Integritee: 'wss://rococo.api.integritee.network'
    }
  },
  {
    info: 'rococoKabocha',
    paraId: 2113,
    text: 'Kabocha (kabsoup)',
    providers: {
      JelliedOwl: 'wss://kabsoup1.jelliedowl.com'
    }
  },
  {
    info: 'rococoLitentry',
    paraId: 2106,
    text: 'Litentry',
    providers: {
      Litentry: 'wss://rpc.rococo-parachain-sg.litentry.io'
    }
  },
  {
    info: 'rococoMangata',
    paraId: 2110,
    text: 'Mangata',
    providers: {
      Mangata: 'wss://roccoco-testnet-collator-01.mangatafinance.cloud'
    }
  },
  {
    info: 'rococoMd5',
    paraId: 2089,
    text: 'MD5 Network',
    providers: {
      'Hashed Systems': 'wss://c1.md5.network'
    }
  },
  {
    info: 'rococoMoonsama',
    paraId: 2055,
    text: 'Moonsama',
    providers: {
      // Moonsama: 'wss://moonsama-testnet-rpc.moonsama.com' // https://github.com/polkadot-js/apps/issues/7526
    }
  },
  {
    info: 'rococoNodle',
    paraId: 2026,
    text: 'Nodle',
    providers: {
      OnFinality: 'wss://nodle-paradis.api.onfinality.io/public-ws'
    }
  },
  {
    info: 'chainoli',
    homepage: 'https://www.my-oli.com/en/',
    paraId: 4023,
    text: 'OLI',
    providers: {}
  },
  {
    info: 'rococoOriginTrailParachain',
    homepage: 'https://parachain.origintrail.io',
    paraId: 2043,
    text: 'OriginTrail Testnet',
    providers: {
      TraceLabs: 'wss://parachain-testnet-rpc.origin-trail.network/'
    }
  },
  {
    info: 'rococoPangolin',
    paraId: 2105,
    text: 'Pangolin',
    providers: {
      'Darwinia Network': 'wss://pangolin-parachain-rpc.darwinia.network'
    }
  },
  {
    info: 'rococoKilt',
    paraId: 2086,
    text: 'RILT',
    providers: {
      'KILT Protocol': 'wss://rococo.kilt.io'
    }
  },
  {
    info: 'robonomics',
    homepage: 'http://robonomics.network/',
    paraId: 2048,
    text: 'Robonomics',
    providers: {
      Airalab: 'wss://rococo.rpc.robonomics.network'
    }
  },
  {
    info: 'rocfinity',
    paraId: 2021,
    text: 'Rocfinity',
    providers: {
      Efinity: 'wss://rpc.rococo.efinity.io'
    }
  },
  {
    info: 'snowbridge',
    paraId: 3016,
    text: 'Snowbridge',
    providers: {
      Snowfork: 'wss://rococo-rpc.snowbridge.network'
    }
  },
  {
    info: 'rococoSubsocial',
    paraId: 2100,
    text: 'SoonsocialX',
    providers: {
      DappForce: 'wss://rco-para.subsocial.network'
    }
  },
  {
    info: 'rococoSora',
    paraId: 2011,
    text: 'SORA',
    providers: {
      Soramitsu: 'wss://ws.parachain-collator-1.c1.stg1.sora2.soramitsu.co.jp'
    }
  },
  {
    info: 'rococoSpreehafen',
    paraId: 2116,
    text: 'Spreehafen',
    providers: {
      DataHighway: 'wss://spreehafen.datahighway.com'
    }
  },
  {
    info: 'stagex',
    homepage: 'https://totemaccounting.com/',
    paraId: 2007,
    text: 'Stagex',
    providers: {
      Totem: 'wss://s-ui.kapex.network'
    }
  },
  {
    info: 'rococoSubzero',
    paraId: 4040,
    text: 'Subzero',
    providers: {
      ZERO: 'wss://staging.para.sub.zero.io'
    }
  },
  {
    info: 't0rn',
    paraId: 3333,
    text: 't0rn',
    providers: {
      t3rn: 'wss://dev.net.t3rn.io'
    }
  },
  {
    info: 'rococoTinkernet',
    paraId: 2125,
    text: 'Tinkernet',
    providers: {
      // 'InvArch Team': 'wss://rococo.invarch.network' // https://github.com/polkadot-js/apps/issues/8266
    }
  },
  {
    info: 'rococoTuring',
    paraId: 2114,
    text: 'Turing Network (Staging)',
    providers: {
      OAK: 'wss://rpc.turing-staging.oak.tech'
    }
  },
  {
    info: 'rococoUnitNetwork',
    paraId: 4168,
    text: 'Unit Network',
    providers: {
      UnitNetwork: 'wss://www.unitnode3.info:443'
    }
  },
  {
    info: 'rococoVirto',
    paraId: 3003,
    text: 'Virto',
    providers: {
      // VirtoNetwork: 'wss://rococo.virtonetwork.xyz' // https://github.com/polkadot-js/apps/issues/8024
    }
  },
  {
    info: 'rococoWatr',
    paraId: 2058,
    text: 'Watr Network',
    providers: {
      Watr: 'wss://rpc.dev.watr.org'
    }
  },
  {
    info: 'rococoZeitgeist',
    paraId: 2101,
    text: 'Zeitgeist Battery Station',
    providers: {
      Zeitgeist: 'wss://roc.zeitgeist.pm'
    }
  }
];

// Based on history, this will expand so keep it as a singular chunk
export function createRococo (t: TFunction): EndpointOption {
  return {
    dnslink: 'rococo',
    genesisHash: ROCOCO_GENESIS,
    info: 'rococo',
    text: t('rpc.rococo', 'Rococo', { ns: 'apps-config' }),
    providers: {
      Parity: 'wss://rococo-rpc.polkadot.io',
      'light client': 'light://substrate-connect/rococo'
      // OnFinality: 'wss://rococo.api.onfinality.io/public-ws', // After reset, node misses host functions
      // Pinknode: 'wss://rpc.pinknode.io/rococo/explorer' // After reset, syncs to old chain
      // 'Ares Protocol': 'wss://rococo.aresprotocol.com' // https://github.com/polkadot-js/apps/issues/5767
    },
    teleport: [1000, 1002],
    linked: [
      // these are the base chains
      {
        info: 'rococoStatemint',
        paraId: 1000,
        text: t('rpc.rococo.statemint', 'Statemint', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://rococo-statemint-rpc.polkadot.io'
        },
        teleport: [-1]
      },
      {
        info: 'rococoCanvas',
        paraId: 1002,
        text: t('rpc.rococo.canvas', 'Canvas', { ns: 'apps-config' }),
        providers: {
          Parity: 'wss://rococo-canvas-rpc.polkadot.io'
        },
        teleport: [-1]
      },
      {
        info: 'encointer',
        homepage: 'https://encointer.org/',
        paraId: 1003,
        text: t('rpc.rococo.encointer', 'Encointer Lietaer', { ns: 'apps-config' }),
        providers: {
          'Encointer Association': 'wss://rococo.api.encointer.org'
        },
        teleport: [-1]
      },
      // add any additional parachains here, alphabetical
      {
        info: 'arctic',
        isUnreachable: true, // https://github.com/polkadot-js/apps/issues/7420
        paraId: 3025,
        text: t('rpc.rococo.arctic', 'Arctic', { ns: 'apps-config' }),
        providers: {
          Arctic: 'wss://arctic-rpc-parachain.icenetwork.io:9944'
        }
      },
      {
        info: 'rococoBasilisk',
        paraId: 2090,
        text: t('rpc.rococo.basilisk', 'Basilisk', { ns: 'apps-config' }),
        providers: {
          'Galactic Council': 'wss://rpc-01.basilisk-rococo.hydradx.io'
        }
      },
      {
        info: 'rococoBitgreen',
        paraId: 3024,
        text: t('rpc.rococo.bitgreen', 'Bitgreen', { ns: 'apps-config' }),
        providers: {
          Bitgreen: 'wss://rococobitgreen.abhath-labs.com'
        }
      },
      {
        info: 'rococoCatalyst',
        paraId: 2031,
        text: t('rpc.rococo.catalyst', 'Catalyst', { ns: 'apps-config' }),
        providers: {
          Centrifuge: 'wss://fullnode.catalyst.cntrfg.com'
        }
      },
      {
        info: 'rococoDolphin',
        paraId: 2084,
        text: t('rpc.rococo.dolphin', 'Dolphin', { ns: 'apps-config' }),
        providers: {
          'Manta Network': 'wss://anjie.rococo.dolphin.engineering'
        }
      },
      {
        info: 'rocfinity',
        paraId: 2051,
        text: t('rpc.rococo.efinity.io', 'Efinity', { ns: 'apps-config' }),
        providers: {
          Efinity: 'wss://rpc.rococo.efinity.io'
        }
      },
      {
        info: 'rococoGenshiro',
        paraId: 2024,
        text: t('rpc.rococo.genshiro', 'Genshiro Rococo Testnet', { ns: 'apps-config' }),
        providers: {
          Equilibrium: 'wss://parachain-testnet.equilab.io/rococo/collator/node1/wss'
        }
      },
      {
        info: 'rococoIntegritee',
        paraId: 3002,
        text: t('rpc.rococo.integritee', 'Integritee Network', { ns: 'apps-config' }),
        providers: {
          Integritee: 'wss://rococo.api.integritee.network'
        }
      },
      {
        info: 'rococoTinker',
        paraId: 2014,
        text: t('rpc.rococo.tinker', 'InvArch Tinkernet', { ns: 'apps-config' }),
        providers: {
          OnFinality: 'wss://invarch-tinkernet.api.onfinality.io/public-ws'
        }
      },
      {
        info: 'rococoLitentry',
        paraId: 2106,
        text: t('rpc.rococo.litentry', 'Litentry', { ns: 'apps-config' }),
        providers: {
          Litentry: 'wss://rpc.rococo-parachain-sg.litentry.io'
        }
      },
      {
        info: 'rococoMoonsama',
        paraId: 2055,
        text: t('rpc.rococo.moonsama', 'Moonsama', { ns: 'apps-config' }),
        providers: {
          Moonsama: 'wss://moonsama-testnet-rpc.moonsama.com'
        }
      },
      {
        info: 'rococoNodle',
        paraId: 2026,
        text: t('rpc.rococo.nodle', 'Nodle', { ns: 'apps-config' }),
        providers: {
          OnFinality: 'wss://node-6913072722034561024.lh.onfinality.io/ws?apikey=84d77e2e-3793-4785-8908-5096cffea77a'
        }
      },
      {
        info: 'rococoPangolin',
        paraId: 2105,
        text: t('rpc.rococo.pangolin', 'Pangolin Parachain', { ns: 'apps-config' }),
        providers: {
          'Darwinia Network': 'wss://pangolin-parachain-rpc.darwinia.network'
        }
      },
      {
        info: 'rococoKilt',
        paraId: 2015,
        text: t('rpc.rococo.kilt', 'RILT', { ns: 'apps-config' }),
        providers: {
          'KILT Protocol': 'wss://rococo.kilt.io'
        }
      },
      {
        info: 'rococoSubsocial',
        paraId: 2100,
        text: t('rpc.rococo.subsocial', 'SoonsocialX', { ns: 'apps-config' }),
        providers: {
          DappForce: 'wss://rco-para.subsocial.network'
        }
      },
      {
        info: 'rococoSpreehafen',
        paraId: 2116,
        text: t('rpc.rococo.spreehafen', 'Spreehafen', { ns: 'apps-config' }),
        providers: {
          DataHighway: 'wss://spreehafen.datahighway.com'
        }
      },
      {
        info: 't0rn',
        paraId: 3333,
        text: t('rpc.rococo.t3rn', 't0rn', { ns: 'apps-config' }),
        providers: {
          t3rn: 'wss://dev.net.t3rn.io'
        }
      },
      {
        info: 'rococoZeitgeist',
        isDisabled: true, // See https://github.com/polkadot-js/apps/issues/5842
        paraId: 2050,
        text: t('rpc.rococo.zeitgeist', 'Zeitgeist PC', { ns: 'apps-config' }),
        providers: {
          Zeitggeist: 'wss://roc.zeitgeist.pm'
        }
      }
    ]
  };
}
