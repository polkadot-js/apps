// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Icon } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = I18nProps & {
  controllerId: string,
  onError: (error: string | null) => void,
  sessionId: string,
  stashId: string
};

type State = {
  error: string | null
};

class ValidateSession extends React.PureComponent<Props, State> {
  state: State = {
    error: null
  };

  static getDerivedStateFromProps ({ onError, sessionId, stashId, t }: Props, prevState: State): State | null {
    let error = null;

    try {
      const pair = keyring.getPair(sessionId);

      if (pair.type !== 'ed25519') {
        error = t('The selected account is not an ed25519 (Edwards) account as required for validation');
      } else if (sessionId === stashId) {
        error = t('For fund security, your session key should not match your stash key.');
      } else {
        error = null;
      }
    } catch (e) {
      // this _should_ never happen...
      error = t('The account {{sessionId}} is not a valid account', { replace: { sessionId } });
    }

    if (error === prevState.error) {
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

export default translate(ValidateSession);
