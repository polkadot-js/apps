// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export enum BitLengthOption {
  CHAIN_SPEC = 128,
  NORMAL_NUMBERS = 32
}

export enum ScreenSizes {
  DESKTOP = 992,
  TABLET = 768,
  PHONE = 576
}

export const rewardDestinationOptions = [
  { text: 'Stash account (increase the amount at stake)', value: 0 },
  { text: 'Stash account (do not increase the amount at stake)', value: 1 },
  { text: 'Controller account', value: 2 }
];
