import BN from 'bn.js';

export const ZERO = new BN(0);

// Keyring stuff:
// --------------------------------------

import keyring from '@polkadot/ui-keyring';

export function findNameByAddress (address: string): string | undefined {
  try {
    return keyring.getAccount(address).getMeta().name;
  } catch (error) {
    try {
      return keyring.getAddress(address).getMeta().name;
    } catch (error) {
      // ok, we don't have account or address
      return undefined;
    }
  }
}

// String, Numbers, Object
// --------------------------------------

export const isDefined = (x: any): boolean =>
  !notDefined(x);

export const isDef = isDefined;

export const notDefined = (x: any): boolean =>
  x === null || typeof x === 'undefined';

export const notDef = notDefined;

export const isObj = (x: any): boolean =>
  x !== null && typeof x === 'object';

export const isStr = (x: any): boolean =>
  typeof x === 'string';

export const isNum = (x: any): boolean =>
  typeof x === 'number';

export const isEmptyStr = (x: any): boolean =>
  notDefined(x) || isStr(x) && x.trim().length === 0;

export const nonEmptyStr = (x?: any) =>
  isStr(x) && x.trim().length > 0;

export const parseNumStr = (num: string): number | undefined => {
  try {
    return parseInt(num, undefined);
  } catch (err) {
    return undefined;
  }
};

export const nonEmptyArr = (x: any): boolean =>
  Array.isArray(x) && x.length > 0;
