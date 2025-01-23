// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const AddressIdentityOtherDiscordKey = 'Discord';

export enum CoreTimeTypes {
  'Reservation',
  'Lease',
  'Bulk Coretime',
  'On Demand'
}

export const ChainRenewalStatus = {
  Eligible: 'eligible',
  None: '-',
  Renewed: 'renewed'
};

// block time on coretime chain is 2 x slower than on relay chain
export const BlockTimeCoretimeToRelayConstant = 2;
