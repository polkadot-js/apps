// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import React, { useRef } from 'react';

import { ApiPromise } from '@polkadot/api';
import { useApi, useBlockInterval } from '@polkadot/react-hooks';
import { calcBlockTime } from '@polkadot/react-hooks/useBlockTime';
import { BN } from '@polkadot/util';

import Dropdown from './Dropdown';
import { useTranslation } from './translate';

export interface Props {
  className?: string;
  help?: string
  label?: React.ReactNode;
  onChange?: (value: number) => void;
  value?: number;
  voteLockingPeriod?: BN;
}

const CONVICTIONS: [number, number, BN][] = [1, 2, 4, 8, 16, 32].map((lock, index) => [index + 1, lock, new BN(lock)]);

function createOptions (api: ApiPromise, t: TFunction, blockTime: BN, voteLockingPeriod?: BN): { text: string; value: number }[] {
  return [
    { text: t<string>('0.1x voting balance, no lockup period'), value: 0 },
    ...CONVICTIONS.map(([value, lock, bnLock]): { text: string; value: number } => ({
      text: t<string>('{{value}}x voting balance, locked for {{lock}}x duration ({{period}})', {
        replace: {
          lock,
          period: calcBlockTime(blockTime, bnLock.mul(
            voteLockingPeriod ||
            api.consts.democracy.voteLockingPeriod ||
            api.consts.democracy.enactmentPeriod
          ), t)[1],
          value
        }
      }),
      value
    }))
  ];
}

function Convictions ({ className = '', help, label, onChange, value, voteLockingPeriod }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const blockTime = useBlockInterval();

  const optionsRef = useRef(createOptions(api, t, blockTime, voteLockingPeriod));

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
