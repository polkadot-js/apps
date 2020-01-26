// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '../types';

export default [
  {
    info: 'kusama',
    text: 'Kusama (Polkadot Canary, hosted by Parity)',
    value: 'wss://kusama-rpc.polkadot.io/',
    withI18n: true
  },
  {
    info: 'kusama',
    text: 'Kusama (Polkadot Canary, hosted by Web3 Foundation)',
    value: 'wss://cc3-5.kusama.network/',
    withI18n: true
  },
  {
    info: 'westend',
    text: 'Westend (Polkadot Testnet, hosted by Parity)',
    value: 'wss://westend-rpc.polkadot.io',
    withI18n: true
  },
  {
    info: 'edgeware',
    text: 'Edgeware Testnet (Edgeware Testnet, hosted by Commonwealth Labs)',
    value: 'wss://testnet4.edgewa.re',
    withI18n: true
  },
  {
    info: 'substrate',
    text: 'Flaming Fir (Substrate Testnet, hosted by Parity)',
    value: 'wss://substrate-rpc.parity.io/',
    withI18n: true
  },
  {
    info: 'substrate',
    text: 'Kulupu (Kulupu Mainnet, hosted by Kulupu)',
    value: 'wss://rpc.kulupu.network/ws',
    withI18n: true
  },
  {
    info: 'local',
    text: 'Local Node (Own, 127.0.0.1:9944)',
    value: 'ws://127.0.0.1:9944/',
    withI18n: true
  }
] as Option[];
