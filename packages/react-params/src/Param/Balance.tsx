// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BareProps } from '../types';

import BN from 'bn.js';
import React from 'react';
import { InputBalance } from '@polkadot/react-components';

import Bare from './Bare';

type Props = BareProps;

function onChange ({ isError, onChange }: Props): (_?: BN) => void {
  return function (value?: BN): void {
    if (!onChange) {
      return;
    }

    onChange({
      isValid: !isError && !!value,
      value
    });
  };
}

function Balance (props: Props): React.ReactElement<Props> {
  const { className, defaultValue: { value }, isDisabled, isError, label, onEnter, style, withLabel } = props;
  const defaultValue = new BN((value as BN || '0').toString()).toString(10);

  return (
    <Bare
      className={className}
      style={style}
    >
      <InputBalance
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={onChange(props)}
        withEllipsis
        onEnter={onEnter}
        withLabel={withLabel}
      />
    </Bare>
  );
}

export {
  Balance
};

export default Balance;
