// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Param$Types, Param$Type$Array, ExtrinsicDecoded } from '@polkadot/params/types';

import './Params.css';

import React from 'react';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import addressEncode from '@polkadot/util-keyring/address/encode';
import u8aToHex from '@polkadot/util/u8a/toHex';
import isBn from '@polkadot/util/is/bn';
import isU8a from '@polkadot/util/is/u8a';
import isUndefined from '@polkadot/util/is/undefined';

import classes from '../util/classes';
import { textMap as thresholdTextMap } from './Param/VoteThreshold';

const empty = div('<empty>');
const unknown = div('<unknown>');

function divWithClass (className: string, ...values: Array<React.ReactNode>): React.ReactNode {
  return (
    <div className={classes('ui--Param-text', className)}>
      {values}
    </div>
  );
}

function div (...values: Array<React.ReactNode>): React.ReactNode {
  return divWithClass.apply(
    null, [undefined as React.ReactNode].concat(values)
  );
}

function accountToText (publicKey: Uint8Array): React.ReactNode {
  const address = addressEncode(publicKey);

  return divWithClass(
    'nowrap',
    <IdentityIcon
      className='icon'
      size={24}
      value={address}
    />,
    address
  );
}

function proposalToText ({ extrinsic, params }: ExtrinsicDecoded): React.ReactNode {
  if (!extrinsic) {
    return unknown;
  }

  const inputs = extrinsic.params.map(({ name, type }, index) =>
    div(
      divWithClass('name', `${name}=`),
      valueToText(type, params[index])
    )
  );

  return div(
    divWithClass('name', `${extrinsic.section}.${extrinsic.name}(`),
    inputs,
    divWithClass('name', ')')
  );
}

function arrayToText (type: Param$Type$Array, value: Array<any>, withBound: boolean = true): React.ReactNode {
  if (value.length === 0) {
    return empty;
  }

  if (type.length === 1) {
    if (type[0] === 'KeyValueStorage') {
      return div(value.length);
    }

    return value.map((value, index) =>
      div(
        divWithClass('name', `${index}:`),
        valueToText(type[0], value, false)
      )
    );
  }

  const values = type.map((_type, index) =>
    valueToText(_type, value[index], false)
  );

  return div(
    divWithClass('name', '('),
    values,
    divWithClass('name', ')')
  );
}

function valueToText (type: Param$Types, value: any, swallowError: boolean = true): React.ReactNode {
  try {
    if (type === 'bool') {
      return div(value ? 'Yes' : 'No');
    }

    if (isUndefined(value)) {
      return unknown;
    }

    if (Array.isArray(type)) {
      return arrayToText(type, value);
    }

    if (type === 'AccountId') {
      return value && value.length
        ? accountToText(value as Uint8Array)
        : unknown;
    }

    if (type === 'Proposal') {
      return proposalToText(value as ExtrinsicDecoded);
    }

    if (type === 'VoteThreshold') {
      return div(thresholdTextMap[value]);
    }

    if (isU8a(value)) {
      return div(u8aToHex(value, 256));
    }

    if (isBn(value)) {
      return div(numberFormat(value));
    }
  } catch (error) {
    if (!swallowError) {
      throw error;
    } else {
      console.log('valueToText', type, value, error);
    }
  }

  return div(value.toString());
}

export default valueToText;
