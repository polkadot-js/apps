// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';
import styled from 'styled-components';
import { classes } from '@canvas-ui/react-util';

import { useTranslation } from './translate';

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
          <Loader
            active
            className={classes(className, 'ui--Spinner app')}
            indeterminate
            inline='centered'
            size='medium'
          >
            {text || t<string>('Loading')}
          </Loader>
        )
        : children
      }
    </>
  );
}

export default React.memo(styled(WithLoader)`
  color: var(--grey50);
  height: 100%;
  display: flex;
  align-items: center;
`);
