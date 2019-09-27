// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Icon } from '@polkadot/react-components';

import translate from '../../translate';

interface Props extends I18nProps {
  unstakeThreshold: BN | undefined;
  onError: (error: string | null) => void;
}

function InputValidationUnstakeThreshold ({ onError, t, unstakeThreshold }: Props): React.ReactElement<Props> | null {
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    if (unstakeThreshold) {
      let newError = null;

      if (unstakeThreshold.ltn(0)) {
        newError = t('The Threshold must be a positive number');
      } else if (unstakeThreshold.gtn(10)) {
        newError = t('The Threshold must lower than 11');
      }

      if (newError !== error) {
        onError(newError);
        setError(newError);
      }
    }
  }, [unstakeThreshold]);

  if (!error) {
    return null;
  }

  return (
    <article className='warning'>
      <div><Icon name='warning sign' />{error}</div>
    </article>
  );
}

export default translate(InputValidationUnstakeThreshold);
