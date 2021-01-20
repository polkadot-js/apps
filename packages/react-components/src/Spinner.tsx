// Copyright 2017-2020 @canvas-ui/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';
import styled from 'styled-components';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  label?: React.ReactNode;
  variant?: 'app' | 'push' | 'mini' | 'cover';
}

function Spinner ({ className = '', label, variant = 'app' }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <div className={`${className} ui--Spinner ${variant}${variant === 'cover' ? ' isCover' : ''}`}>
      <Loader
        active
        className='ui--highlight--spinner'
        indeterminate
        inline='centered'
        size='medium'
      >
        {variant === 'app' && (
          label || t<string>('Retrieving data')
        )}
      </Loader>
    </div>
  );
}

export default React.memo(styled(Spinner)`
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

  .text {
    margin: 0 auto 1.5rem auto;
    opacity: 0.6;
    text-align: center;
  }
`);
