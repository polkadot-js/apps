// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressInfo, AddressRow, Button, Card } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import Forgetting from './modals/Forgetting';

import translate from './translate';

type Props = I18nProps & {
  address: string
};

type State = {
  current: KeyringAddress,
  isEditable: boolean,
  isForgetOpen: boolean
};

class Address extends React.PureComponent<Props> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { address } = this.props;

    this.state = {
      current: keyring.getAddress(address),
      isEditable: true,
      isForgetOpen: false
    };
  }

  render () {
    const { address } = this.props;
    const { isEditable } = this.state;

    return (
      <Card>
        {this.renderModals()}
        <AddressRow
          buttons={this.renderButtons()}
          isEditable={isEditable}
          value={address}
          withBalance={false}
          withIndex
          withNonce={false}
          withTags
        >
          <AddressInfo
            withBalance={{ available: true, free: true, total: true }}
            withExtended={{ nonce: true }}
            value={address}
          />
        </AddressRow>
      </Card>
    );
  }

  private renderModals () {
    const { address } = this.props;
    const { isForgetOpen, current } = this.state;

    if (!address) {
      return null;
    }

    const modals = [];

    if (isForgetOpen) {
      modals.push(
        <Forgetting
          currentAddress={current}
          doForget={this.onForget}
          key='modal-forget-account'
          onClose={this.toggleForget}
        />
      );
    }

    return modals;
  }

  private toggleForget = (): void => {
    const { isForgetOpen } = this.state;

    this.setState({
      isForgetOpen: !isForgetOpen
    });
  }

  private onForget = (): void => {
    const { address, t } = this.props;

    if (!address) {
      return;
    }

    const status = {
      account: address,
      action: 'forget'
    } as ActionStatus;

    try {
      keyring.forgetAddress(address);
      status.status = 'success';
      status.message = t('address forgotten');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }
  }

  private renderButtons () {
    const { t } = this.props;
    const { isEditable } = this.state;

    return (
      <div className='accounts--Account-buttons buttons'>
        {isEditable && (
          <>
            <Button
              isNegative
              onClick={this.toggleForget}
              icon='trash'
              size='small'
              tooltip={t('Forget this account')}
            />
          </>
        )}
      </div>
    );
  }
}

export default translate(Address);
