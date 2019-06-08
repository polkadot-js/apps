// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { Icon } from '@polkadot/ui-app';

import translate from '../../translate';

type Props = I18nProps & {
  unstakeThreshold: BN | undefined,
  onError: (error: string | null) => void
};

type State = {
  error: string | null
};

class InputValidationUnstakeThreshold extends React.PureComponent<Props, State> {
  state: State = {
    error: null
  };

  static getDerivedStateFromProps ({ onError, t, unstakeThreshold }: Props, prevState: State): State | null {
    let error = null;

    if (!unstakeThreshold) {
      return null;
    }

    if (unstakeThreshold.ltn(0)) {
      error = t('The Threshold must be a positive number');
    } else if (unstakeThreshold.gtn(10)) {
      error = t('The Threshold must lower than 11');
    }

    if (error === prevState.error || !unstakeThreshold) {
      return null;
    }

    onError(error);

    return { error };
  }

  render () {
    const { error } = this.state;

    if (!error) {
      return null;
    }

    return (
      <article className='warning'>
        <div><Icon name='warning sign' />{error}</div>
      </article>
    );
  }
}

export default translate(InputValidationUnstakeThreshold);
