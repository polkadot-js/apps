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
  variant?: 'app' | 'button' | 'push' | 'mini';
}

function Spinner ({ className = '', label, variant = 'app' }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <div className={`${className} ui--Spinner${variant === 'button' ? ' isInline' : ''}`}>
      <img
        className={['push', 'button'].includes(variant) ? '' : 'ui--highlight--bg'}
        src={spinnerSrc as unknown as string}
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

  &.isInline {
    display: inline-block;
    height: 0;
    overflow: visible;
    vertical-align: middle;

    img {
      margin: -50% 0.5rem -0.17rem 0;
      opacity: 1;
    }
  }

  img {
    border-radius: 10rem;
    opacity: 0.75;
  }

  .text {
    color: inherit !important;
    margin: 0.25rem auto 1.5rem auto;
    opacity: 0.6;
  }
`);
