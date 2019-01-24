// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import './Params.css';

import React from 'react';
import { classes } from '@polkadot/ui-app/util';
import { isNull, isUndefined, u8aToHex } from '@polkadot/util';

// import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
// import formatNumber from '@polkadot/ui-app/util/formatNumber';
// import keyring from '@polkadot/ui-keyring';
// import u8aToHex from '@polkadot/util/u8a/toHex';
// import isBn from '@polkadot/util/is/bn';
// import isU8a from '@polkadot/util/is/u8a';

// import { textMap as thresholdTextMap } from './Param/VoteThreshold';

// const empty = div({}, '<empty>');
const unknown = div({}, '<unknown>');

type DivProps = {
  className?: string,
  key?: any
};

function div ({ key, className }: DivProps, ...values: Array<React.ReactNode>): React.ReactNode {
  return (
    <div
      className={classes('ui--Param-text', className)}
      key={key}
    >
      {values}
    </div>
  );
}

// function accountToText (_address: string | Uint8Array): React.ReactNode {
//   const address = isU8a(_address)
//     ? encodeAddress(_address)
//     : _address;

//   return div(
//     { className: 'nowrap', key: `account_${address}` },
//     <IdentityIcon
//       className='icon'
//       key='icon'
//       size={24}
//       value={address}
//     />,
//     div({ key: 'address', className: 'ui--Param-Address' }, address),
//     // Empty div so double clicking on the address only selects the address
//     <div key={address}></div>
//   );
// }

// function proposalToText ({ extrinsic, params }: ExtrinsicDecoded): React.ReactNode {
//   if (!extrinsic) {
//     return unknown;
//   }

//   const inputs = extrinsic.params.map(({ name, type }, index) =>
//     div(
//       { key: `param_${index}` },
//       div({ className: 'name', key: 'param_name' }, `${name}=`),
//       valueToText(type, params[index])
//     )
//   );

//   return div(
//     {},
//     div({ className: 'name' }, `${extrinsic.section}.${extrinsic.name}(`),
//     inputs,
//     div({ className: 'name' }, ')')
//   );
// }

// function arrayToText (type: Param$Type$Array, value: Array<any>, withBound: boolean = true): React.ReactNode {
//   if (value.length === 0) {
//     return empty;
//   }

//   if (type.length === 1) {
//     if (type[0] === 'KeyValueStorage') {
//       return div({}, value.length);
//     }

//     return value.map((value, index) =>
//       div(
//         { key: `value_${index}` },
//         div({ className: 'name', key: 'name' }, `${index}:`),
//         valueToText(type[0], value, false)
//       )
//     );
//   }

//   const values = type.map((_type, index) =>
//     valueToText(_type, value[index], false)
//   );

//   return div(
//     {},
//     div({ className: 'name' }, '('),
//     values,
//     div({ className: 'name' }, ')')
//   );
// }

function valueToText (type: string, value: any, swallowError: boolean = true, contentShorten: boolean = true): React.ReactNode {
  // try {
  //   if (type === 'bool') {
  //     return div({}, value ? 'Yes' : 'No');
  //   }

  //   if (isUndefined(value)) {
  //     return unknown;
  //   }

  //   if (Array.isArray(type)) {
  //     return arrayToText(type, value);
  //   }

  //   if (type === 'AccountId') {
  //     return value && value.length
  //       ? accountToText(value as string)
  //       : unknown;
  //   }

  //   if (type === 'Proposal') {
  //     return proposalToText(value as ExtrinsicDecoded);
  //   }

  //   if (type === 'VoteThreshold') {
  //     return div({}, thresholdTextMap[value]);
  //   }

  //   if (isU8a(value)) {
  //     return div({}, u8aToHex(value, 256));
  //   }

  //   if (isBn(value)) {
  //     return div({}, formatNumber(value));
  //   }
  // } catch (error) {
  //   if (!swallowError) {
  //     throw error;
  //   } else {
  //     console.log('valueToText', type, value, error);
  //   }
  // }

  return isNull(value) || isUndefined(value)
    ? unknown
    : div(
      {},
      ['Bytes', 'Data'].includes(type)
        ? u8aToHex(value.toU8a(true), contentShorten ? 512 : -1)
        : value.toString()
    );
}

export default valueToText;
