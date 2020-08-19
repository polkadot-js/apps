// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { TFunction } from 'i18next';
import React, { useRef } from 'react';
import { ApiPromise } from '@polkadot/api';
import { useApi } from '@polkadot/react-hooks';

import Dropdown from './Dropdown';
import { useTranslation } from './translate';

export interface Props {
  className?: string;
  help?: string
  label?: React.ReactNode;
  onChange?:(value: number) => void;
  value?: number;
}

const CONVICTIONS: [number, number, BN][] = [1, 2, 4, 8, 16, 32].map((lock, index) => [index + 1, lock, new BN(lock)]);
const SEC_DAY = 60 * 60 * 24;

function createOptions (api: ApiPromise, t: TFunction): { text: string; value: number }[] {
  return [
    { text: t<string>('0.1x voting balance, no lockup period'), value: 0 },
    ...CONVICTIONS.map(([value, lock, bnLock]): { text: string; value: number } => ({
      text: t<string>('{{value}}x voting balance, locked for {{lock}}x enactment ({{period}} days)', {
        replace: {
          lock,
          period: (bnLock.mul(api.consts.democracy.enactmentPeriod.mul(api.consts.timestamp.minimumPeriod.muln(2)).divn(1000)).toNumber() / SEC_DAY).toFixed(2),
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

  const optionsRef = useRef(createOptions(api, t));

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
