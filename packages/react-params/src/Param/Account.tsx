// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';
import { InputAddress } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import Bare from './Bare';

function onChange ({ onChange }: Props): (_?: string | null) => void {
  return (value?: string | null): void => {
    let isValid = false;

    if (value) {
      try {
        keyring.decodeAddress(value);

        isValid = true;
      } catch (err) {
        console.error(err);
      }
    }

    onChange && onChange({
      isValid,
      value
    });
  };
}

export default function Account (props: Props): React.ReactElement<Props> {
  const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = props;
  const defaultValue = value && value.toString();

  return (
    <Bare
      className={className}
      style={style}
    >
      <InputAddress
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        isInput
        label={label}
        onChange={onChange(props)}
        placeholder='5...'
        type='allPlus'
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}
