// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from './types';

const DEV: Option[] = [
  {
    info: 'local',
    text: 'Local Node (Own, 127.0.0.1:9944)',
    value: 'ws://127.0.0.1:9944/'
  }
];

const LIVE: Option[] = [

];

const TEST: Option[] = [
  {
    info: 'amber',
    text: 'Centrifuge Testnet Amber (Full Node, hosted by Centrifuge)',
    value: 'wss://fullnode.amber.centrifuge.io'
  },
  {
    info: 'flint',
    text: 'Centrifuge Testnet Flint (Full Node, hosted by Centrifuge)',
    value: 'wss://fullnode.flint.centrifuge.io'
  },
  {
    info: 'flint',
    text: 'Centrifuge Testnet Flint (Validator 0, hosted by Centrifuge)',
    value: 'ws://35.246.244.114:9944'
  },
  {
    info: 'flint',
    text: 'Centrifuge Testnet Flint (Validator 1, hosted by Centrifuge)',
    value: 'ws://34.89.148.219:9944'
  },
  {
    info: 'fulvous',
    text: 'Centrifuge Testnet Fulvous (Validator 0, hosted by Centrifuge)',
    value: 'ws://35.246.140.178:9944'
  },
  {
    info: 'fulvous',
    text: 'Centrifuge Testnet Fulvous (Validator 1, hosted by Centrifuge)',
    value: 'ws://35.198.166.26:9944'
  },
];

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../logos, specifically in namedLogos
//   text: The text to display on teh dropdown
//   value: The actual hosted secure websocket endpoint
export default [
  {
    isHeader: true,
    text: 'Live networks',
    value: ''
  },
  ...LIVE,
  {
    isHeader: true,
    text: 'Test networks',
    value: ''
  },
  ...TEST,
  {
    isHeader: true,
    text: 'Development',
    value: ''
  },
  ...DEV
].map((option): Option => ({ ...option, withI18n: true }));
