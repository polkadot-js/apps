// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Icon } from '@polkadot/ui-app';

import translate from '../../translate';

interface Props extends I18nProps {
  controllerId: string;
  onError: (error: string | null) => void;
  sessionId: string | null;
  stashId: string;
}

interface State {
  error: string | null;
}

class ValidateSessionEd25519 extends React.PureComponent<Props, State> {
  public state: State = {
    error: null
  };

  public static getDerivedStateFromProps ({ onError, sessionId, stashId, t }: Props, prevState: State): State | null {
    let error = null;

    if (sessionId === stashId) {
      error = t('For fund security, your session key should not match your stash key.');
    } else {
      error = null;
    }

    if (error === prevState.error) {
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

export default translate(ValidateSessionEd25519);
