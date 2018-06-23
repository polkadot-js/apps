// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { Param$Types, Param$Type$Array, ExtrinsicDecoded } from '@polkadot/params/types';

import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import addressEncode from '@polkadot/util-keyring/address/encode';
import u8aToHex from '@polkadot/util/u8a/toHex';
import isBn from '@polkadot/util/is/bn';
import isU8a from '@polkadot/util/is/u8a';

function proposalToText ({ extrinsic, params }: ExtrinsicDecoded): string {
  if (!extrinsic) {
    return '<unknown>';
  }

  const inputs = extrinsic.params.map(({ name, type }, index) =>
    `${name}=${valueToText(type, params[index])}`
  ).join(', ');

  return `${extrinsic.section}.${extrinsic.name}(${inputs})`;
}

function arrayToText (type: Param$Type$Array, value: Array<any>, withBound: boolean = true): string {
  if (value.length === 0) {
    return 'empty';
  }

  if (type.length === 1) {
    return value.map((value) =>
      valueToText(type[0], value, false)
    ).join(', ');
  }

  const values = type.map((_type, index) =>
    valueToText(_type, value[index], false)
  ).join(', ');

  return `(${values})`;
}

function valueToText (type: Param$Types, value: any, swallowError: boolean = true): string {
  try {
    if (type === 'bool') {
      return value ? 'Yes' : 'No';
    }

    if (!value) {
      return 'unknown';
    }

    if (Array.isArray(type)) {
      return arrayToText(type, value);
    }

    if (type === 'AccountId') {
      return addressEncode((value as Uint8Array));
    }

    if (type === 'Proposal') {
      return proposalToText((value as ExtrinsicDecoded));
    }

    if (isU8a(value)) {
      return u8aToHex((value as Uint8Array), 256);
    }

    if (isBn(value)) {
      return numberFormat((value as BN));
    }
  } catch (error) {
    if (!swallowError) {
      throw error;
    } else {
      console.log('valueToText', type, value, error);
    }
  }

  return value.toString();
}

export default valueToText;
