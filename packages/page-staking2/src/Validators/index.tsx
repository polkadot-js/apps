// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../types';

import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';

import Legend from '@polkadot/app-staking/Legend';
import { Table } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import usePoints from './usePoints';
import ValidatorRow from './Validator';

interface Props {
  className?: string;
  favorites: string[];
  isRelay: boolean;
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
  validatorsSession?: Validator[];
}

interface ValidatorSplit {
  validatorsActive?: Validator[],
  validatorsFavorite?: Validator[]
}

function splitValidators (allAccounts: string[], favorites: string[], validators?: Validator[]): ValidatorSplit {
  if (!validators) {
    return {};
  }

  // sort stashes, our accounts bubble to the top
  const validatorsAll = validators.sort((a, b) => {
    const isAccountA = allAccounts.includes(a.stashId);

    return isAccountA === allAccounts.includes(b.stashId)
      ? 0
      : isAccountA
        ? -1
        : 1;
  });
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

function Validators ({ className = '', favorites, isRelay, sessionInfo, toggleFavorite, validatorsSession }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const points = usePoints(sessionInfo.activeEra);

  const { validatorsActive, validatorsFavorite } = useMemo(
    () => splitValidators(allAccounts, favorites, validatorsSession),
    [allAccounts, favorites, validatorsSession]
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
        <StyledTable
          className={className}
          header={headerFavorite.current}
          isSplit
          legend={
            <Legend
              isRelay={isRelay}
            />
          }
        >
          {validatorsFavorite.map((v) => (
            <ValidatorRow
              isFavorite
              isRelay={isRelay}
              key={v.key}
              points={points?.[v.stashId]}
              sessionInfo={sessionInfo}
              toggleFavorite={toggleFavorite}
              validator={v}
            />
          ))}
        </StyledTable>
      )}
      <StyledTable
        className={className}
        empty={validatorsActive && t<string>('No session validators found')}
        emptySpinner={t<string>('Retrieving session validators')}
        header={headerActive.current}
        isSplit
        legend={
          !validatorsFavorite && (
            <Legend
              isRelay={isRelay}
            />
          )
        }
      >
        {validatorsActive?.map((v) => (
          <ValidatorRow
            isFavorite={false}
            isRelay={isRelay}
            key={v.key}
            points={points?.[v.stashId]}
            sessionInfo={sessionInfo}
            toggleFavorite={toggleFavorite}
            validator={v}
          />
        ))}
      </StyledTable>
    </>
  );
}

const StyledTable = styled(Table)`
  div.floatingStatus {
    position: absolute;
    left: 1rem;
    top: 0;
  }
`;

export default React.memo(Validators);
