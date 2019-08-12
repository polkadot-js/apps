// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, StakingLedger } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Icon } from '@polkadot/react-components';
import { Option } from '@polkadot/types';
import { withCalls } from '@polkadot/react-api';

import translate from '../../translate';

interface Props extends I18nProps {
  accountId: string | null;
  bondedId?: string | null;
  controllerId: string | null;
  defaultController?: string;
  onError: (error: string | null) => void;
  stashId?: string | null;
}

interface State {
  error: string | null;
}

class ValidateController extends React.PureComponent<Props, State> {
  public state: State = {
    error: null
  };

  public static getDerivedStateFromProps ({ accountId, bondedId, controllerId, defaultController, onError, stashId, t }: Props, prevState: State): State {
    const error = ((): string | null => {
      if (defaultController === controllerId) {
        // don't show an error if the selected controller is the default
        // this applies when changing controller
        return null;
      } else if (controllerId === accountId) {
        return t('Please select distinct stash and controller accounts');
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

  public render (): React.ReactNode {
    const { accountId } = this.props;
    const { error } = this.state;

    if (!error || !accountId) {
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
      transform: (value: Option<AccountId>): string | null => {
        const extracted = value.unwrapOr(null);

        return extracted
          ? extracted.toString()
          : null;
      }
    }],
    ['query.staking.ledger', {
      paramName: 'controllerId',
      propName: 'stashId',
      transform: (value: Option<StakingLedger>): string | null => {
        const extracted = value.unwrapOr({ stash: null }).stash;

        return extracted
          ? extracted.toString()
          : null;
      }

    }]
  )(ValidateController)
);
