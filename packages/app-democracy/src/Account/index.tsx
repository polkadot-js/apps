// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { AddressMini, AddressSummary, Button } from '@polkadot/ui-app';
import { I18nProps } from '@polkadot/ui-app/types';
import React from 'react';
import { withCalls, withMulti } from '@polkadot/ui-api';

import { AccountFilter } from '../types';
import Delegate from './Delegate';
import translate from '../translate';
import Undelegate from './Undelegate';

type Props = ApiProps & I18nProps & {
  accountId: string,
  filter: AccountFilter,
  name: string,
  delegate?: AccountId
};

type State = {
  isDelegateOpen: boolean,
  isUndelegateOpen: boolean
};

class Account extends React.PureComponent<Props, State> {
  state: State = {
    isDelegateOpen: false,
    isUndelegateOpen: false
  };

  render () {
    const { accountId, filter, name } = this.props;

    // TODO : Apply filter

    // Each component is rendered and gets a `is[Component]Openwill` passed in a `isOpen` props.
    // These components will be loaded and return null at the first load (because is[Component]Open === false).
    // This is deliberate in order to display the Component modals in a performant matter later on
    // because their state will already be loaded.
    return (
      <article className='democracy--Account'>
        {this.renderDelegate()}
        {this.renderUndelegate()}
        <AddressSummary
          name={name}
          value={accountId}
          identIconSize={96}
          withIndex={false}
          withNonce={false}
        >
          <div className='democracy--Account-expand'>
            {this.renderButtons()}
            {this.renderDelegateId()}
          </div>
        </AddressSummary>
      </article>
    );
  }

  private renderDelegate () {
    const { accountId } = this.props;
    const { isDelegateOpen } = this.state;

    return (
      <Delegate
        accountId={accountId}
        isOpen={isDelegateOpen}
        onClose={this.toggleDelegate}
      />
    );
  }

  private renderUndelegate () {
    const { accountId } = this.props;
    const { isUndelegateOpen } = this.state;

    return (
      <Undelegate
        accountId={accountId}
        isOpen={isUndelegateOpen}
        onClose={this.toggleUndelegate}
      />
    );
  }

  private renderDelegateId () {
    const { t, delegate } = this.props;

    if (!delegate) {
      return null;
    }

    const [[delegateId]] = delegate;

    return (
      <div className='democracy--Account-detail'>
        <label className='democracy--label'>{t('delegate')}</label>
        <AddressMini
          value={delegateId}
        />
      </div>
    );
  }

  private renderButtons () {
    const { accountId, delegate, t } = this.props;
    const buttons = [];

    if (!delegate) {
      buttons.push(
        <Button
          isPrimary
          key='delegate'
          onClick={this.toggleDelegate}
          label={t('Delegate')}
        />
      );
    } else {
      buttons.push(
        <Button
          isNegative
          key='undelegate'
          onClick={this.toggleUndelegate}
          label={t('Undelegate')}
        />
      );
    }

    return (
      <Button.Group>
        {buttons}
      </Button.Group>
    );
  }

  private toggleDelegate = () => {
    this.setState(({ isDelegateOpen }) => ({
      isDelegateOpen: !isDelegateOpen
    }));
  }

  private toggleUndelegate = () => {
    this.setState(({ isUndelegateOpen }) => ({
      isUndelegateOpen: !isUndelegateOpen
    }));
  }
}

export default withMulti(
  Account,
  translate,
  withCalls<Props>(
    ['query.democracy.delegations', {
      paramName: 'accountId',
      propName: 'delegate'
    }]
  )
);
