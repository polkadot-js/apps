// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import './Params.css';

import React from 'react';
import { classes } from '@polkadot/ui-app/util';
import { isNull, isUndefined, u8aToHex } from '@polkadot/util';
import { Option, U8a } from '@polkadot/types';

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

function valueToText (type: string, value: any, swallowError: boolean = true, contentShorten: boolean = true): React.ReactNode {
  // dont' even ask, nested ?: ... really?
  return isNull(value) || isUndefined(value)
    ? unknown
    : div(
      {},
      ['Bytes', 'Data'].includes(type)
        ? u8aToHex(value.toU8a(true), contentShorten ? 512 : -1)
        : (
          value instanceof U8a
            ? (
              value.isEmpty
                ? '<empty>'
                : value.toString()
            )
            : (
              (value instanceof Option) && value.isNone
                ? '<empty>'
                : value.toString()
            )
        )
    );
}

export default valueToText;
