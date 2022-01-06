// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

export enum BitLengthOption {
  CHAIN_SPEC = 128,
  NORMAL_NUMBERS = 32
}

export const ScreenSizes = {
  DESKTOP: 992,
  PHONE: 576,
  TABLET: 768
};

export const rewardDestinationOptions = [
  { text: 'Stash account (increase the amount at stake)', value: 0 },
  { text: 'Stash account (do not increase the amount at stake)', value: 1 },
  { text: 'Controller account', value: 2 }
];
