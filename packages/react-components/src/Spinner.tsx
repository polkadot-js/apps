// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import spinnerSrc from './Spinner.png';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  label?: React.ReactNode;
  noLabel?: boolean;
  variant?: 'app' | 'appPadded' | 'cover' | 'push' | 'mini';
}

// prefetch
const img = new Image();

img.src = spinnerSrc as string;

function Spinner ({ className = '', label, noLabel, variant = 'app' }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <StyledSpinner className={`${className} ui--Spinner variant-${variant}`}>
      <img
        className={variant === 'push' ? '' : 'highlight--bg highlight--border'}
        src={spinnerSrc as string}
      />
      {!noLabel && variant.startsWith('app') && <div className='text'>{label || t<string>('Retrieving data')}</div>}
    </StyledSpinner>
  );
}

const StyledSpinner = styled.div`
  display: block;
  line-height: 1rem;
  margin: 0 auto;
  text-align: center;

  &.variant-appPadded {
    margin-top: 0.5rem;
  }

  img {
    border: 1px solid transparent;
    border-radius: 10rem;
  }

  &.variant-cover {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;

    img {
      border: 1 px solid white;
      margin: 0 auto;
    }
  }

  .text {
    color: inherit !important;
    margin: 0.25rem auto 1.5rem auto;
    opacity: var(--opacity-light);

    div+div {
      margin-top: 0.25rem;
    }
  }
`;

export default React.memo(Spinner);
