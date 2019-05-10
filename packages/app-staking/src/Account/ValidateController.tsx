// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Icon } from '@polkadot/ui-app';
import { AccountId, Option, StakingLedger } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  bondedId?: string | null,
  controllerId: string,
  onError: (error: string | null) => void,
  stashId?: string | null
};

type State = {
  error: string | null
};

class ValidateController extends React.PureComponent<Props, State> {
  state: State = {
    error: null
  };

  static getDerivedStateFromProps ({ accountId, bondedId, controllerId, onError, stashId, t }: Props, prevState: State): State {
    const error = (() => {
      if (controllerId === accountId) {
        return t('A controller account which is not the same as your selected account is required');
      } else if (bondedId) {
        return t('A controller account should not map to another stash. This selected controller is a stash, controlled by {{bondedId}}', { replace: { bondedId } });
      } else if (stashId) {
        return t('A controller account should not be set to manages multiple stashes. The selected controller is already controlling {{stashId}}', { replace: { stashId } });
      }

      return null;
    })();

    if (prevState.error !== error) {
      onError(error);
    }

    return {
      error
    };
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

export default translate(
  withCalls<Props>(
    ['query.staking.bonded', {
      paramName: 'controllerId',
      propName: 'bondedId',
      transform: (value: Option<AccountId>) => {
        const extracted = value.unwrapOr(null);

        return extracted
          ? extracted.toString()
          : null;
      }
    }],
    ['query.staking.ledger', {
      paramName: 'controllerId',
      propName: 'stashId',
      transform: (value: Option<StakingLedger>) => {
        const extracted = value.unwrapOr({ stash: null }).stash;

        return extracted
          ? extracted.toString()
          : null;
      }

    }]
  )(ValidateController)
);
