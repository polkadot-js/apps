// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IndexedValidator, SessionInfo } from '../types';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import usePoints from './usePoints';
import Validator from './Validator';

interface Props {
  className?: string;
  favorites: string[];
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
  validators?: string[];
}

interface ValidatorSplit {
  validatorsActive?: IndexedValidator[],
  validatorsFavorite?: IndexedValidator[]
}

function splitValidators (favorites: string[], validators?: string[]): ValidatorSplit {
  if (!validators) {
    return {};
  }

  const validatorsAll = validators.map((stashId, stashIndex) => ({ stashId, stashIndex }));
  const validatorsFavorite = validatorsAll.filter(({ stashId }) => favorites.includes(stashId));

  return validatorsFavorite.length
    ? {
      validatorsActive: validatorsAll.filter((v) =>
        !validatorsFavorite.some((f) =>
          f.stashId === v.stashId
        )
      ),
      validatorsFavorite
    }
    : { validatorsActive: validatorsAll };
}

function Validators ({ className = '', favorites, sessionInfo, toggleFavorite, validators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const points = usePoints(sessionInfo.activeEra);

  const { validatorsActive, validatorsFavorite } = useMemo(
    () => splitValidators(favorites, validators),
    [favorites, validators]
  );

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
          {validatorsFavorite.map(({ stashId, stashIndex }) => (
            <Validator
              isFavorite
              key={stashId}
              points={points?.[stashId]}
              sessionInfo={sessionInfo}
              stashId={stashId}
              stashIndex={stashIndex}
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
        {validatorsActive?.map(({ stashId, stashIndex }) => (
          <Validator
            isFavorite={false}
            key={stashId}
            points={points?.[stashId]}
            sessionInfo={sessionInfo}
            stashId={stashId}
            stashIndex={stashIndex}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Validators);
