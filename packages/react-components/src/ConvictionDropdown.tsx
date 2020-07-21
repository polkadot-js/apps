// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState, useMemo } from 'react';
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

const CONVICTIONS: [number, number][] = [1, 2, 4, 8, 16, 32].map((lock, index) => [index + 1, lock]);
const SEC_DAY = 60 * 60 * 24;

// REMOVE once Polkadot is upgraded with the correct conviction
const PERIODS: Record<string, BN> = {
  '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3': new BN(403200)
};

function AvailableDisplay ({ className = '', help, label, onChange, value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const [enact] = useState(
    ((PERIODS[api.genesisHash.toHex()] || api.consts.democracy.enactmentPeriod).toNumber() * api.consts.timestamp.minimumPeriod.toNumber() / 1000 * 2) / SEC_DAY
  );

  const convictionOpts = useMemo(() => [
    { text: t<string>('0.1x voting balance, no lockup period'), value: 0 },
    ...CONVICTIONS.map(([value, lock]): { text: string; value: number } => ({
      text: t<string>('{{value}}x voting balance, locked for {{lock}}x enactment ({{period}} days)', {
        replace: {
          lock,
          period: (enact * lock).toFixed(2),
          value
        }
      }),
      value
    }))
  ], [t, enact]);

  return (
    <Dropdown
      className={className}
      help={help}
      label={label}
      onChange={onChange}
      options={convictionOpts}
      value={value}
    />
  );
}

export default React.memo(AvailableDisplay);
