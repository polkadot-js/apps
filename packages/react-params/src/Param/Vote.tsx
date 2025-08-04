// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types.js';

import React, { useCallback, useMemo, useRef } from 'react';

import { Dropdown } from '@polkadot/react-components';
import { GenericVote } from '@polkadot/types';
import { isBn, isNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Bare from './Bare.js';

const AYE_MASK = 0b10000000;

// In this approach, it will avoid using additional local states and instead rely directly on the parent-provided values and methods.
function Vote ({ className = '', defaultValue: { value }, isDisabled, isError, onChange, withLabel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  // Derive aye and conviction from the value prop
  const { aye, conviction } = useMemo(() => {
    // Logic sucks here, but to be honest, can not find other way to do it
    const resolvedAye = value instanceof GenericVote
      ? value.isAye
      : isBn(value)
        ? !!(value.toNumber() & AYE_MASK)
        : isNumber(value)
          ? !!(value & AYE_MASK)
          : typeof value === 'object' && value !== null && 'aye' in value
            ? !!value.aye
            : true;

    const resolvedConviction = value instanceof GenericVote
      ? value.conviction.index
      : typeof value === 'object' && value !== null && 'conviction' in value
        ? Number(value.conviction)
        : 0;

    return {
      aye: resolvedAye,
      conviction: resolvedConviction
    };
  }, [value]);

  const onChangeVote = useCallback(
    (newAye: boolean) => {
      onChange?.({ isValid: true, value: { aye: newAye, conviction } });
    },
    [conviction, onChange]
  );

  const onChangeConviction = useCallback(
    (newConviction: number) => {
      onChange?.({ isValid: true, value: { aye, conviction: newConviction } });
    },
    [aye, onChange]
  );

  const optAyeRef = useRef([
    { text: t('Nay'), value: false },
    { text: t('Aye'), value: true }
  ]);

  const optConvRef = useRef([
    { text: t('None'), value: 0 },
    { text: t('Locked1x'), value: 1 },
    { text: t('Locked2x'), value: 2 },
    { text: t('Locked3x'), value: 3 },
    { text: t('Locked4x'), value: 4 },
    { text: t('Locked5x'), value: 5 },
    { text: t('Locked6x'), value: 6 }
  ]);

  return (
    <Bare className={className}>
      <Dropdown
        className='full'
        defaultValue={aye}
        isDisabled={isDisabled}
        isError={isError}
        label={t('aye: bool')}
        onChange={onChangeVote}
        options={optAyeRef.current}
        withLabel={withLabel}
      />
      <Dropdown
        className='full'
        defaultValue={conviction}
        isDisabled={isDisabled}
        isError={isError}
        label={t('conviction: Conviction')}
        onChange={onChangeConviction}
        options={optConvRef.current}
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Vote);
