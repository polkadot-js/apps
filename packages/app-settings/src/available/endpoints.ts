// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '../types';

export default [
  {
    info: 'amber',
    text: 'Centrifuge Testnet Amber (Full Node, hosted by Centrifuge)',
    value: 'ws://35.246.192.167:9944'
  },
  {
    info: 'flint',
    text: 'Centrifuge Testnet Flint (Full Node, hosted by Centrifuge)',
    value: 'ws://35.234.84.110:9944'
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
  {
    info: 'local',
    text: 'Local Node (Own, 127.0.0.1:9944)',
    value: 'ws://127.0.0.1:9944/'
  }
].map((option): Option => ({ ...option, withI18n: true }));
