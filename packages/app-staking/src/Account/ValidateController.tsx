// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Icon } from '@polkadot/ui-app';import { AccountId, Option, StakingLedger } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  controllerId: string,
  staking_bonded?: Option<AccountId>,
  staking_ledger?: Option<StakingLedger>
};

type State = {
  bondedId: string | null,
  stashId: string | null
};

class ValidateController extends React.PureComponent<Props, State> {
  state: State = {
    bondedId: null,
    stashId: null
  };

  static getDerivedStateFromProps ({ staking_bonded, staking_ledger }: Props): State {
    return {
      bondedId: staking_bonded && staking_bonded.isSome
        ? staking_bonded.unwrap().toString()
        : null,
      stashId: staking_ledger && staking_ledger.isSome
        ? staking_ledger.unwrap().stash.toString()
        : null
    };
  }

  render () {
    const { accountId, controllerId, t } = this.props;
    const { bondedId, stashId } = this.state;
    let error;

    if (controllerId === accountId) {
      error = t('A controller account which is not the same as your selected account is recommended');
    } else if (bondedId) {
      error = t('A controller account should not map to another stash. This selected controller is a stash, controlled by {{bondedId}}', { replace: { bondedId } });
    } else if (stashId) {
      error = t('A controller account should not be set to manages multiple stashes. The selected controller is already controlling {{stashId}}', { replace: { stashId } });
    } else {
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
    ['query.staking.bonded', { paramName: 'controllerId' }],
    ['query.staking.ledger', { paramName: 'controllerId' }]
  )(ValidateController)
);
