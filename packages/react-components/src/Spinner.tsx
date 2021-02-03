// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import spinnerSrc from './Spinner.png';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  label?: React.ReactNode;
  noLabel?: boolean;
  variant?: 'app' | 'cover' | 'push' | 'mini';
}

// prefetch
const img = new Image();

img.src = spinnerSrc as string;

function Spinner ({ className = '', label, noLabel, variant = 'app' }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <div className={`${className} ui--Spinner${variant === 'cover' ? ' isCover' : ''}`}>
      <img
        className={variant === 'push' ? '' : 'highlight--bg highlight--border'}
        src={spinnerSrc as string}
      />
      {!noLabel && variant === 'app' && <div className='text'>{label || t('Retrieving data')}</div>}
    </div>
  );
}

export default React.memo(styled(Spinner)`
  display: block;
  line-height: 1rem;
  margin: 0 auto;
  text-align: center;

  &.isCover {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;

    img {
      border: 1 px solid white;
      margin: 0 auto;
    }
  }

  img {
    border: 1px solid transparent;
    border-radius: 10rem;
  }

  .text {
    color: inherit !important;
    margin: 0.25rem auto 1.5rem auto;
    opacity: 0.6;

    div+div {
      margin-top: 0.25rem;
    }
  }
`);
