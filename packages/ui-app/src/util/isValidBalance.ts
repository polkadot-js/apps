// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { EncodingVersions } from '@polkadot/params/types';

import BN from 'bn.js';
import sizes from '@polkadot/params/sizes';

// RegEx Pattern (positive int): http://regexlib.com/REDetails.aspx?regexp_id=330
const re = RegExp('^[0-9]+[0-9]*$');

export default function isValidBalance (input: any, chain: string): boolean {
  if (!(typeof input === 'string')) {
    throw Error('Balance input value must be of string type');
  } else if (input.indexOf('e+') !== -1) {
    throw Error('Balance input value must not be in scientific notation');
  }

  // apiSupport.chain is either 'poc-1' (64 bit) or 'latest' (128 bit)
  const balanceSize: any = sizes.Balance.get(chain as EncodingVersions) || 64;
  const max64Bit = '18446744073709551615';
  const max128Bit = '340282366920938463463374607431768211455';
  const maxBN64Bit = new BN(max64Bit);
  const maxBN128Bit = new BN(max128Bit);
  const inputBN = new BN(input);

  if (input.trim().length === 0 || !re.test(input.trim())) {
    return false;
  }

  if (chain === 'poc-1' && balanceSize === 64 && maxBN64Bit.gte(inputBN)) {
    return true;
  }

  if (chain === 'latest' && balanceSize === 128 && maxBN128Bit.gte(inputBN)) {
    return true;
  }

  return false;
}
