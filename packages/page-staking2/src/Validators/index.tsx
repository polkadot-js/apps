// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import usePoints from './usePoints';
import Validator from './Validator';

interface Props {
  className?: string;
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
  validatorsActive?: string[];
  validatorsFavorite?: string[];
}

function Validators ({ className = '', sessionInfo: { activeEra }, toggleFavorite, validatorsActive, validatorsFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const points = usePoints(activeEra);

  const headerActive = useRef<[string?, string?, number?][]>([
    // favorite, details, expand
    [t<string>('validators'), 'start', 3]
  ]);

  const headerFavorite = useRef<[string?, string?, number?][]>([
    // favorite, details, expand
    [t<string>('favorites'), 'start', 3]
  ]);

  return (
    <>
      {validatorsFavorite && (
        <Table
          className={className}
          header={headerFavorite.current}
          isSplit
        >
          {validatorsFavorite.map((stashId) => (
            <Validator
              activeEra={activeEra}
              isFavorite
              key={stashId}
              points={points?.[stashId]}
              stashId={stashId}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </Table>
      )}
      <Table
        className={className}
        empty={validatorsActive && t<string>('No session validators found')}
        emptySpinner={t<string>('Retrieving session validators')}
        header={headerActive.current}
        isSplit
      >
        {validatorsActive?.map((stashId) => (
          <Validator
            activeEra={activeEra}
            isFavorite={false}
            key={stashId}
            points={points?.[stashId]}
            stashId={stashId}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Validators);
