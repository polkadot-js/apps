// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo } from '../types.js';

import React, { useRef, useState } from 'react';

import { Button, styled, ToggleGroup } from '@polkadot/react-components';

import Legend from '../Legend.js';
import { useTranslation } from '../translate.js';
import useValidatorsActive from '../useValidatorsActive.js';
import Active from './Active/index.js';
import Waiting from './Waiting/index.js';
import usePoints from './usePoints.js';

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
    { text: t('Active'), value: 'active' },
    { text: t('Waiting'), value: 'waiting' }
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
