// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SessionInfo, Validator } from '../types';

import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, ToggleGroup } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import ListActive from './ListActive';
import ListWaiting from './ListWaiting';
import usePoints from './usePoints';

interface Props {
  className?: string;
  favorites: string[];
  isRelay: boolean;
  sessionInfo: SessionInfo;
  toggleFavorite: (stashId: string) => void;
  validatorsActive?: Validator[];
}

function Validators ({ className = '', favorites, isRelay, sessionInfo, toggleFavorite, validatorsActive }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [intentIndex, setIntentIndex] = useState(0);
  const points = usePoints(sessionInfo);

  const intentOptions = useRef([
    { text: t('Active'), value: 'active' },
    { text: t('Waiting'), value: 'waiting' }
  ]);

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
          <ListActive
            isRelay={isRelay}
            points={points}
            sessionInfo={sessionInfo}
            toggleFavorite={toggleFavorite}
            validatorsActive={validatorsActive}
          />
        )
        : (
          <ListWaiting
            favorites={favorites}
            isRelay={isRelay}
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
