// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

let addressQty: (addressAll?: Array<any>) => number;

let isAddress: (addressAll?: Array<any>) => boolean;

let isNoAddress: (addressAll?: Array<any>) => boolean;

addressQty = (addressAll?: Array<any>): number =>
  isAddress(addressAll) && addressAll ? Object.keys(addressAll).length : 0;

isAddress = (addressAll?: Array<any>): boolean =>
  !isNoAddress(addressAll);

isNoAddress = (addressAll?: Array<any>): boolean =>
  !addressAll || !Object.keys(addressAll).length;

export {
  addressQty,
  isAddress,
  isNoAddress
};
