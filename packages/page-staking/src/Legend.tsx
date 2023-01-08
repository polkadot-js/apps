// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';
import styled from 'styled-components';

import { Badge, Tag } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  isRelay?: boolean;
  minCommission?: BN;
}

function Legend ({ className, isRelay, minCommission }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <span>
        <Badge
          color='blue'
          icon='chevron-right'
        />
        <span>{t('Next session')}</span>
      </span>
      {minCommission && (
        <span>
          <Badge
            color='red'
            icon='cancel'
          />
          <span>{t('Chilled')}</span>
        </span>
      )}
      {isRelay && (
        <span>
          <Badge
            color='purple'
            icon='vector-square'
          />
          <span>{t('Para validator')}</span>
        </span>
      )}
      <span>
        <Badge
          color='green'
          info='5'
        />
        <span>{t('Produced blocks')}</span>
      </span>
      <span>
        <Badge
          color='green'
          icon='envelope'
        />
        <span>{t('Online message')}</span>
      </span>
      <span>
        <Badge
          color='green'
          icon='hand-paper'
        />
        <span>{t('Nominating')}</span>
      </span>
      <span>
        <Badge
          color='red'
          icon='balance-scale-right'
        />
        <span>{t('Oversubscribed')}</span>
      </span>
      <span>
        <Badge
          color='red'
          icon='skull-crossbones'
        />
        <span>{t('Slashed')}</span>
      </span>
      <span>
        <Badge
          color='red'
          icon='user-slash'
        />
        <span>{t('Blocks nominations')}</span>
      </span>
      <span>
        <Tag
          color='lightgrey'
          label='1,220'
        />
        <span>{t('Era points')}</span>
      </span>
    </div>
  );
}

export default React.memo(styled(Legend)`
  font-size: 0.85rem;
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
`);
