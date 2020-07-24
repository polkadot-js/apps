// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from './translate';
import spinnerSrc from './Spinner-2.png';

interface Props {
  className?: string;
  label?: React.ReactNode;
  variant?: 'app' | 'cover' | 'push' | 'mini';
}

// prefetch
const img = new Image();

img.src = spinnerSrc as string;

function Spinner ({ className = '', label, variant = 'app' }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <div className={`${className} ui--Spinner${variant === 'cover' ? ' isCover' : ''}`}>
      <img
        className={variant === 'push' ? '' : 'ui--highlight--bg ui--highlight--border'}
        src={spinnerSrc as string}
      />
      {variant === 'app' && <div className='text'>{label || t('Retrieving data')}</div>}
    </div>
  );
}

export default React.memo(styled(Spinner)`
  display: block;
  line-height: 1;
  margin: 0 auto;
  text-align: center;

  &.isCover {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;

    img {
      margin: 0 auto;
      opacity: 1;
    }
  }

  img {
    border: 1px solid transparent;
    border-radius: 10rem;
    opacity: 0.75;
  }

  .text {
    color: inherit !important;
    margin: 0.25rem auto 1.5rem auto;
    opacity: 0.6;
  }
`);
