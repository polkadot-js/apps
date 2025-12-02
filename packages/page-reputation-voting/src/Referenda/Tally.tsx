// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { styled } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  tally?: {
    ayes: BN;
    nays: BN;
    turnout: number;
  };
}

function Tally ({ className = '', tally }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  if (!tally) {
    return (
      <StyledDiv className={className}>
        <span className='loading'>{t('Loading...')}</span>
      </StyledDiv>
    );
  }

  const total = tally.ayes.add(tally.nays);
  const ayePercent = total.isZero()
    ? 0
    : tally.ayes.muln(100).div(total).toNumber();

  return (
    <StyledDiv className={className}>
      <div className='tally-bar'>
        <div
          className='aye-bar'
          style={{ width: `${ayePercent}%` }}
        />
      </div>
      <div className='tally-values'>
        <span className='aye'>
          {t('Aye')}: {formatNumber(tally.ayes)}
        </span>
        <span className='nay'>
          {t('Nay')}: {formatNumber(tally.nays)}
        </span>
      </div>
      <div className='turnout'>
        {t('Voters')}: {formatNumber(tally.turnout)}
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  min-width: 150px;

  .tally-bar {
    background: var(--bg-page);
    border-radius: 4px;
    height: 8px;
    overflow: hidden;
    width: 100%;

    .aye-bar {
      background: var(--color-status-ok);
      height: 100%;
      transition: width 0.3s ease;
    }
  }

  .tally-values {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    margin-top: 0.25rem;

    .aye {
      color: var(--color-status-ok);
    }

    .nay {
      color: var(--color-status-error);
    }
  }

  .turnout {
    color: var(--color-label);
    font-size: 0.75rem;
    text-align: center;
  }

  .loading {
    color: var(--color-label);
    font-size: 0.85rem;
  }
`;

export default React.memo(Tally);
