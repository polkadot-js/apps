// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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

function AvailableDisplay ({ className = '', help, label, onChange, value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const [enact] = useState(
    (api.consts.democracy.enactmentPeriod.toNumber() * api.consts.timestamp.minimumPeriod.toNumber() / 1000 * 2) / 60 / 60 / 24
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
