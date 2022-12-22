// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import React, { useRef } from 'react';

import { useBlockInterval } from '@polkadot/react-hooks';
import { calcBlockTime } from '@polkadot/react-hooks/useBlockTime';
import { BN, BN_ZERO } from '@polkadot/util';

import Dropdown from './Dropdown';
import { useTranslation } from './translate';

export interface Props {
  className?: string;
  help?: string
  label?: React.ReactNode;
  onChange?: (value: number) => void;
  value?: number;
  voteLockingPeriod: BN;
}

const CONVICTIONS = [1, 2, 4, 8, 16, 32].map((lock, index): [value: number, duration: number, durationBn: BN] => [index + 1, lock, new BN(lock)]);

function createOptions (blockTime: BN, voteLockingPeriod: BN, t: TFunction): { text: string; value: number }[] {
  return [
    { text: t<string>('0.1x voting balance, no lockup period'), value: 0 },
    ...CONVICTIONS.map(([value, duration, durationBn]): { text: string; value: number } => ({
      text: t<string>('{{value}}x voting balance, locked for {{duration}}x duration{{period}}', {
        replace: {
          duration,
          period: voteLockingPeriod && voteLockingPeriod.gt(BN_ZERO)
            ? ` (${calcBlockTime(blockTime, durationBn.mul(voteLockingPeriod), t)[1]})`
            : '',
          value
        }
      }),
      value
    }))
  ];
}

function Convictions ({ className = '', help, label, onChange, value, voteLockingPeriod }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const blockTime = useBlockInterval();
  const optionsRef = useRef(createOptions(blockTime, voteLockingPeriod, t));

  return (
    <Dropdown
      className={className}
      help={help}
      label={label}
      onChange={onChange}
      options={optionsRef.current}
      value={value}
    />
  );
}

export default React.memo(Convictions);
