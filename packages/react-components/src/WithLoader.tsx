// Copyright 2017-2021 @canvas-ui/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';
import styled from 'styled-components';

import { useTranslation } from './translate';
import { BareProps } from './types';

interface Props extends BareProps {
  isLoading?: boolean;
  text?: React.ReactNode;
}

function WithLoader ({ children = null, className, isLoading = false, text }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <>
      {isLoading
        ? (
          <div className={className}>
            <Loader
              active
              className='spinner'
              indeterminate
              inline='centered'
              size='medium'
            >
              {text || t<string>('Loading')}
            </Loader>
          </div>
        )
        : children
      }
    </>
  );
}

export default React.memo(styled(WithLoader)`
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 100vh;
  position: absolute;
  right: 0;
  left: 0;

  .spinner {
    color: var(--grey50);
    height: 100% !important;
    display: flex;
    align-items: center;
  }
`);
