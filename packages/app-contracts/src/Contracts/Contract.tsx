// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import keyring from '@polkadot/ui-keyring';
import { AddressRow, Button, Card, Forget, Messages } from '@polkadot/ui-app';
import { getContractAbi } from '@polkadot/ui-app/util';
import { withMulti } from '@polkadot/ui-api';

import translate from '../translate';

type Props = I18nProps & RouteComponentProps & {
  basePath: string,
  address: string,
  onCall: (callAddress?: string, callMethod?: string) => void
};

type State = {
  isBackupOpen: boolean,
  isForgetOpen: boolean,
  isPasswordOpen: boolean
};

class Contract extends React.PureComponent<Props> {
  state: State;

  constructor (props: Props) {
    super(props);
    this.state = {
      isBackupOpen: false,
      isForgetOpen: false,
      isPasswordOpen: false
    };
  }

  render () {
    const { address, onCall } = this.props;

    const contractAbi = getContractAbi(address);

    if (!contractAbi) {
      return null;
    }

    return (
      <Card>
        {this.renderModals()}
        <AddressRow
          buttons={this.renderButtons()}
          isContract
          isEditable
          type='contract'
          value={address}
          withBalance={false}
          withNonce={false}
          withTags
        >
          <Messages
            address={address}
            contractAbi={contractAbi}
            isRemovable={false}
            onSelect={onCall}
          />
        </AddressRow>
      </Card>
    );
  }

  private renderModals () {
    const { address } = this.props;
    const { isForgetOpen } = this.state;

    if (!address) {
      return null;
    }

    const modals = [];

    if (isForgetOpen) {
      modals.push(
        <Forget
          address={address}
          mode='contract'
          onForget={this.onForget}
          key='modal-forget-contract'
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
      keyring.forgetContract(address);
      status.status = 'success';
      status.message = t('address forgotten');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }
    this.toggleForget();
  }

  private renderButtons () {
    const { address, onCall, t } = this.props;

    return (
      <div className='contracts--Contract-buttons'>
        <Button
          isNegative
          onClick={this.toggleForget}
          icon='trash'
          size='small'
          tooltip={t('Forget this contract')}
        />
        <Button
          isPrimary
          label={t('execute')}
          labelIcon='play'
          onClick={() => onCall(address)}
          size='small'
          tooltip={t('Call a method on this contract')}
        />
      </div>
    );
  }
}

export default withMulti(
  Contract,
  translate,
  withRouter
);
