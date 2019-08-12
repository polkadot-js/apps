// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { Icon } from '@polkadot/react-components';

import translate from '../../translate';

interface Props extends I18nProps {
  unstakeThreshold: BN | undefined;
  onError: (error: string | null) => void;
}

interface State {
  error: string | null;
}

class InputValidationUnstakeThreshold extends React.PureComponent<Props, State> {
  public state: State = {
    error: null
  };

  public static getDerivedStateFromProps ({ onError, t, unstakeThreshold }: Props, prevState: State): State | null {
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

  public render (): React.ReactNode {
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
