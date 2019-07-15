// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressCard, AddressInfo, Button, Forget, Icon } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import Transfer from '@polkadot/app-accounts/modals/Transfer';

import translate from './translate';

interface Props extends I18nProps {
  address: string;
}

interface State {
  current?: KeyringAddress;
  isEditable: boolean;
  isForgetOpen: boolean;
  isTransferOpen: boolean;
}

class Address extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    const { address } = this.props;

    this.state = {
      current: keyring.getAddress(address),
      isEditable: true,
      isForgetOpen: false,
      isTransferOpen: false
    };
  }

  public render (): React.ReactNode {
    const { address } = this.props;
    const { isEditable } = this.state;

    return (
      <AddressCard
        buttons={this.renderButtons()}
        isEditable={isEditable}
        type='address'
        value={address}
        withExplorer
        withIndex
        withTags
      >
        {this.renderModals()}
        <AddressInfo
          address={address}
          withBalance={{ available: true, free: true, total: true }}
          withExtended={{ nonce: true }}
        />
      </AddressCard>
    );
  }

  private renderModals (): React.ReactNode {
    const { address } = this.props;
    const { isForgetOpen, isTransferOpen, current } = this.state;

    if (!address || !current) {
      return null;
    }

    const modals = [];

    if (isForgetOpen) {
      modals.push(
        <Forget
          address={current.address}
          onForget={this.onForget}
          key='modal-forget-account'
          mode='address'
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
    this.setState(({ isForgetOpen }): Pick<State, never> => ({
      isForgetOpen: !isForgetOpen
    }));
  }

  private toggleTransfer = (): void => {
    this.setState(({ isTransferOpen }): Pick<State, never> => ({
      isTransferOpen: !isTransferOpen
    }));
  }

  private onForget = (): void => {
    const { address, t } = this.props;

    if (!address) {
      return;
    }

    const status: Partial<ActionStatus> = {
      account: address,
      action: 'forget'
    };

    try {
      keyring.forgetAddress(address);
      status.status = 'success';
      status.message = t('address forgotten');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }
  }

  private renderButtons (): React.ReactNode {
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
              tooltip={t('Forget this address')}
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
