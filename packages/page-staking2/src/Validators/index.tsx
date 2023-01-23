// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../types';

import React, { useRef } from 'react';
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

function Validators ({ className = '', isRelay, sessionInfo, toggleFavorite, validatorsSession }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const points = usePoints(sessionInfo);

  const headerActive = useRef<[string?, string?, number?][]>([
    // favorite, badges, details, expand
    [t<string>('validators'), 'start', 4]
  ]);

  return (
    <StyledTable
      className={className}
      empty={validatorsSession && t<string>('No session validators found')}
      emptySpinner={t<string>('Retrieving session validators')}
      header={headerActive.current}
      isSplit
      legend={
        <Legend
          isRelay={isRelay}
        />
      }
    >
      {validatorsSession?.map((v) => (
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
