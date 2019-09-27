// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Keys, ValidatorId } from '@polkadot/types/interfaces';

import './Params.css';

import React from 'react';
import { classes } from '@polkadot/react-components/util';
import { isNull, isUndefined, u8aToHex } from '@polkadot/util';
import { Option, U8a } from '@polkadot/types';

interface DivProps {
  className?: string;
  key?: any;
}

function div ({ key, className }: DivProps, ...values: React.ReactNode[]): React.ReactNode {
  return (
    <div
      className={classes('ui--Param-text', className)}
      key={key}
    >
      {values}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function valueToText (type: string, value: any, swallowError = true, contentShorten = true): React.ReactNode {
  if (isNull(value) || isUndefined(value)) {
    return div({}, '<unknown>');
  }

  // FIXME dont' even ask, nested ?: ... really?
  return div(
    {},
    ['Bytes', 'Data', 'Option<Keys>', 'Keys'].includes(type)
      ? u8aToHex(value.toU8a(true), contentShorten ? 512 : -1)
      : (
        // HACK Handle Keys as hex-only (this should go away once the node value is
        // consistently swapped to `Bytes`)
        type === 'Vec<(ValidatorId,Keys)>'
          ? JSON.stringify(
            (value as ([ValidatorId, Keys])[]).map(([validator, keys]): [string, string] => [
              validator.toString(), keys.toHex()
            ])
          )
          : (
            value instanceof U8a
              ? (
                value.isEmpty
                  ? '<empty>'
                  : value.toString()
              )
              : (
                (value instanceof Option) && value.isNone
                  ? '<none>'
                  : value.toString()
              )
          )
      )
  );
}

export default valueToText;
