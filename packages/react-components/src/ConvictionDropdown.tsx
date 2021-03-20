// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import BN from 'bn.js';
import React, { useRef } from 'react';

import { ApiPromise } from '@polkadot/api';
import { useApi, useBlockTime } from '@polkadot/react-hooks';
import { BN_THOUSAND } from '@polkadot/util';

import Dropdown from './Dropdown';
import { useTranslation } from './translate';

export interface Props {
  className?: string;
  help?: string
  label?: React.ReactNode;
  onChange?: (value: number) => void;
  value?: number;
}

const CONVICTIONS: [number, number, BN][] = [1, 2, 4, 8, 16, 32].map((lock, index) => [index + 1, lock, new BN(lock)]);
const SEC_DAY = 60 * 60 * 24;

function createOptions (api: ApiPromise, t: TFunction, blockTime: number): { text: string; value: number }[] {
  return [
    { text: t<string>('0.1x voting balance, no lockup period'), value: 0 },
    ...CONVICTIONS.map(([value, lock, bnLock]): { text: string; value: number } => ({
      text: t<string>('{{value}}x voting balance, locked for {{lock}}x enactment ({{period}} days)', {
        replace: {
          lock,
          period: (bnLock.mul(api.consts.democracy.enactmentPeriod.muln(blockTime).div(BN_THOUSAND)).toNumber() / SEC_DAY).toFixed(2),
          value
        }
      }),
      value
    }))
  ];
}

function Convictions ({ className = '', help, label, onChange, value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const [blockTime] = useBlockTime();

  const optionsRef = useRef(createOptions(api, t, blockTime));

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
