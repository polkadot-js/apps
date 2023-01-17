// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../types';

import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';

import Legend from '@polkadot/app-staking/Legend';
import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import usePoints from './usePoints';
import ValidatorRow from './Validator';

interface Props {
  className?: string;
  isRelay: boolean;
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
  validatorsSession?: Validator[];
}

interface ValidatorSplit {
  validatorsActive?: Validator[],
  validatorsFavorite?: Validator[]
}

function splitValidators (validators?: Validator[]): ValidatorSplit {
  if (!validators) {
    return {};
  }

  const validatorsFavorite = validators.filter((v) => v.isFavorite);

  return validatorsFavorite.length
    ? {
      validatorsActive: validators.filter((v) => !v.isFavorite),
      validatorsFavorite
    }
    : { validatorsActive: validators };
}

function Validators ({ className = '', isRelay, sessionInfo, toggleFavorite, validatorsSession }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const points = usePoints(sessionInfo);

  const { validatorsActive, validatorsFavorite } = useMemo(
    () => splitValidators(validatorsSession),
    [validatorsSession]
  );

  const headerActive = useRef<[string?, string?, number?][]>([
    // favorite, badges, details, expand
    [t<string>('validators'), 'start', 4]
  ]);

  const headerFavorite = useRef<[string?, string?, number?][]>([
    // favorite, badges, details, expand
    [t<string>('favorites'), 'start', 4]
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
  td.statusInfo {
    padding: 0 0 0 0.5rem;
    vertical-align: middle;

    > div {
      display: inline-block;
      max-width: 3.6rem;
      min-width: 3.6rem;

      .ui--Badge {
        margin: 0.125rem;

        &.opaque {
          opacity: var(--opacity-gray);
        }
      }
    }

    + td.address {
      padding-left: 0.5rem;
    }
  }
`;

export default React.memo(Validators);
