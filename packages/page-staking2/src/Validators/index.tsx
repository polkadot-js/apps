// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import usePoints from './usePoints';
import Validator from './Validator';

interface Props {
  activeValidators?: string[];
  className?: string;
  favorites: string[];
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
}

function Validators ({ activeValidators, className = '', favorites, sessionInfo: { activeEra }, toggleFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const points = usePoints(activeEra);

  const header = useRef<[string?, string?, number?][]>([
    // favorite, details, expand
    [t<string>('validators'), 'start', 3]
  ]);

  return (
    <Table
      className={className}
      empty={activeValidators && t<string>('No session validators found')}
      emptySpinner={t<string>('Retrieving session validators')}
      header={header.current}
      isSplit
    >
      {activeValidators?.map((stashId) => (
        <Validator
          activeEra={activeEra}
          favorites={favorites}
          key={stashId}
          points={points?.[stashId]}
          stashId={stashId}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </Table>
  );
}

export default React.memo(Validators);
