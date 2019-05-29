// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressInfo, AddressRow, Button, Card, Icon } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import Transfer from '@polkadot/app-accounts/modals/Transfer';
import Forgetting from './modals/Forgetting';

import translate from './translate';

type Props = I18nProps & {
  address: string
};

type State = {
  current: KeyringAddress,
  isEditable: boolean,
  isForgetOpen: boolean,
  isTransferOpen: boolean
};

class Address extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { address } = this.props;

    this.state = {
      current: keyring.getAddress(address),
      isEditable: true,
      isForgetOpen: false,
      isTransferOpen: false
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
          withIndex
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
    const { isForgetOpen, isTransferOpen, current } = this.state;

    if (!address) {
      return null;
    }

    const modals = [];

    if (isForgetOpen) {
      modals.push(
        <Forgetting
          currentAddress={current}
          doForget={this.onForget}
          key='modal-forget'
          onClose={this.toggleForget}
        />
      );
    }

    if (isTransferOpen) {
      modals.push(
        <Transfer
          key='modal-transfer'
          onClose={this.toggleTransfer}
          recipientId={address}
        />
      );
    }

    return modals;
  }

  private toggleForget = (): void => {
    this.setState(({ isForgetOpen }) => ({
      isForgetOpen: !isForgetOpen
    }));
  }

  private toggleTransfer = (): void => {
    this.setState(({ isTransferOpen }) => ({
      isTransferOpen: !isTransferOpen
    }));
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
              key='forget'
              size='small'
              tooltip={t('Forget this account')}
            />
          </>
        )}
        <Button
          isPrimary
          key='deposit'
          label={<><Icon name='paper plane' /> {t('deposit')}</>}
          onClick={this.toggleTransfer}
          size='small'
          tooltip={t('Send funds to this address')}
        />
      </div>
    );
  }
}

export default translate(Address);
