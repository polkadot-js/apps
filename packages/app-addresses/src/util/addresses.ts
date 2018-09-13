// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

let addressesQty: (addressAll?: Array<any>) => number;

let hasAddresses: (addressAll?: Array<any>) => boolean;

let hasNoAddresses: (addressAll?: Array<any>) => boolean;

addressesQty = (addressAll?: Array<any>): number =>
  hasAddresses(addressAll) && addressAll ? Object.keys(addressAll).length : 0;

hasAddresses = (addressAll?: Array<any>): boolean =>
  !hasNoAddresses(addressAll);

hasNoAddresses = (addressAll?: Array<any>): boolean =>
  !addressAll || !Object.keys(addressAll).length;

export {
  addressesQty,
  hasAddresses,
  hasNoAddresses
};
