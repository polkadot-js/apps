// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader/Loader';
import styled from 'styled-components';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  label?: React.ReactNode;
  variant?: 'app' | 'push' | 'mini';
}

function Spinner ({ className, label, variant = 'app' }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <div className={`${className} ui--Spinner ${variant}`}>
      <Loader
        active
        className='ui--highlight--spinner'
        indeterminate
        inline='centered'
        size='medium'
      >
        {variant === 'app' && (
          label || t('Retrieving data')
        )}
      </Loader>
    </div>
  );
}

export default React.memo(styled(Spinner)`
  .text {
    margin: 0 auto 1.5rem auto;
    opacity: 0.6;
    text-align: center;
  }
`);
