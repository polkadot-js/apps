// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Props } from '../types';

import BN from 'bn.js';
import React, { useRef } from 'react';
import { GenericVote } from '@polkadot/types';
import { Dropdown } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Bare from './Bare';

function doChange (onChange?: (value: any) => void): (_: number) => void {
  return function (value: number): void {
    onChange && onChange({
      isValid: true,
      value
    });
  };
}

function Vote ({ className = '', defaultValue: { value }, isDisabled, isError, onChange, withLabel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const optAyeRef = useRef([
    { text: t<string>('Nay'), value: 0 },
    { text: t<string>('Aye'), value: -1 }
  ]);

  const optConvRef = useRef([
    { text: t<string>('None'), value: 0 },
    { text: t<string>('Locked1x'), value: 1 },
    { text: t<string>('Locked2x'), value: 2 },
    { text: t<string>('Locked3x'), value: 3 },
    { text: t<string>('Locked4x'), value: 4 },
    { text: t<string>('Locked5x'), value: 5 },
    { text: t<string>('Locked6x'), value: 6 }
  ]);

  const defaultValue = value instanceof BN
    ? value.toNumber()
    : value instanceof GenericVote
      ? (value.isAye ? -1 : 0)
      : value as number;
  const defaultConv = value instanceof GenericVote
    ? value.conviction.index
    : 0;

  return (
    <Bare className={className}>
      <Dropdown
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={t<string>('aye: bool')}
        onChange={doChange(onChange)}
        options={optAyeRef.current}
        withLabel={withLabel}
      />
      {isDisabled && (
        <Dropdown
          className='full'
          defaultValue={defaultConv}
          isDisabled={isDisabled}
          isError={isError}
          label={t<string>('conviction: Conviction')}
          options={optConvRef.current}
          withLabel={withLabel}
        />
      )}
    </Bare>
  );
}

export default React.memo(Vote);
