// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../../types';

import BN from 'bn.js';
import React from 'react';
import { translate } from 'react-i18next';
import Input from 'semantic-ui-react/dist/es/elements/Input';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import { amount } from './subjects';

type Props = BaseProps & {};

// eslint-disable-next-line no-unused-vars
const onChange = (event: SyntheticEvent<*>, { value }): void => {
  amount.next(
    new BN(value || 0)
  );
};

function Amount ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['extrinsics--split', className].join(' ')}
      style={style}
    >
      <div className='small'>
        <Label>
          {t('transfer.amount', {
            defaultValue: 'sending an amount of'
          })}
        </Label>
        <Input
          defaultValue={1}
          min={0}
          onChange={onChange}
          type='number'
        />
      </div>
    </div>
  );
}

export default translate(['extrinsics'])(Amount);
