// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo } from '../types';

import React, { useRef, useState } from 'react';

import Legend from '@polkadot/app-staking/Legend';
import { Button, styled, ToggleGroup } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import useValidatorsActive from '../useValidatorsActive';
import Active from './Active';
import usePoints from './usePoints';
import Waiting from './Waiting';

interface Props {
  className?: string;
  favorites: string[];
  isRelay: boolean;
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
}

function Validators ({ className = '', favorites, isRelay, sessionInfo, toggleFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [intentIndex, setIntentIndex] = useState(0);
  const validatorsActive = useValidatorsActive(favorites, sessionInfo);
  const points = usePoints(sessionInfo);

  const intentOptions = useRef([
    { text: t<string>('Active'), value: 'active' },
    { text: t<string>('Waiting'), value: 'waiting' }
  ]);

  const legend = <Legend isRelay={isRelay} />;

  return (
    <StyledDiv className={className}>
      <Button.Group>
        <ToggleGroup
          onChange={setIntentIndex}
          options={intentOptions.current}
          value={intentIndex}
        />
      </Button.Group>
      {intentIndex === 0
        ? (
          <Active
            legend={legend}
            points={points}
            sessionInfo={sessionInfo}
            toggleFavorite={toggleFavorite}
            validatorsActive={validatorsActive}
          />
        )
        : (
          <Waiting
            favorites={favorites}
            legend={legend}
            sessionInfo={sessionInfo}
            toggleFavorite={toggleFavorite}
            validatorsActive={validatorsActive}
          />
        )
      }
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .ui--Table table {
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
  }
`;

export default React.memo(Validators);
