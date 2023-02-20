// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { Badge, styled, Tag } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  isRelay?: boolean;
  minCommission?: BN;
}

function Legend ({ className, isRelay, minCommission }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <StyledDiv className={className}>
      <span>
        <Badge
          color='blue'
          icon='chevron-right'
        />
        <span>{t<string>('Next session')}</span>
      </span>
      {minCommission && (
        <span>
          <Badge
            color='red'
            icon='cancel'
          />
          <span>{t<string>('Chilled')}</span>
        </span>
      )}
      {isRelay && (
        <span>
          <Badge
            color='purple'
            icon='vector-square'
          />
          <span>{t<string>('Para validator')}</span>
        </span>
      )}
      <span>
        <Badge
          color='green'
          info='5'
        />
        <span>{t<string>('Produced blocks')}</span>
      </span>
      <span>
        <Badge
          color='green'
          icon='envelope'
        />
        <span>{t<string>('Online message')}</span>
      </span>
      <span>
        <Badge
          color='green'
          icon='hand-paper'
        />
        <span>{t<string>('Nominating')}</span>
      </span>
      <span>
        <Badge
          color='red'
          icon='balance-scale-right'
        />
        <span>{t<string>('Oversubscribed')}</span>
      </span>
      <span>
        <Badge
          color='red'
          icon='skull-crossbones'
        />
        <span>{t<string>('Slashed')}</span>
      </span>
      <span>
        <Badge
          color='red'
          icon='user-slash'
        />
        <span>{t<string>('Blocks nominations')}</span>
      </span>
      <span>
        <Tag
          color='lightgrey'
          label='1,220'
        />
        <span>{t<string>('Era points')}</span>
      </span>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  font-size: var(--font-size-small);
  padding: 1rem 0.5rem;
  text-align: center;

  .ui--Badge, .ui--Tag {
    margin-right: 0.5rem;
  }

  span {
    vertical-align: middle;

    * {
      vertical-align: middle;
    }

    + span {
      margin-left: 1rem;
    }
  }
`;

export default React.memo(Legend);
