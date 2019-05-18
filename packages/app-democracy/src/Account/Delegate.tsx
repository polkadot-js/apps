// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId } from '@polkadot/types';
import { Button, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/ui-app';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  delegateId: AccountId | null,
  isOpen: boolean,
  onClose: () => void
};

type State = {
  lockPeriods?: BN,
  delegateId: string
};

class Delegate extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { accountId, delegateId } = this.props;

    this.state = {
      delegateId: delegateId ? delegateId.toString() : accountId
    };
  }

  render () {
    const { accountId, isOpen, onClose, t } = this.props;
    const { delegateId, lockPeriods } = this.state;
    const hasValue = !!lockPeriods && lockPeriods.gtn(0);
    const canSubmit = hasValue && !!delegateId;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='democracy--Bonding'
        dimmer='inverted'
        open
        size='small'
      >
        {this.renderContent()}
        <Modal.Actions>
          <Button.Group>
            <Button
              isNegative
              onClick={onClose}
              label={t('Cancel')}
            />
            <Button.Or />
            <TxButton
              accountId={accountId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Delegate')}
              onClick={onClose}
              params={[delegateId, lockPeriods]}
              tx='democracy.delegate'
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { accountId, t } = this.props;
    const { delegateId, lockPeriods } = this.state;
    const hasValue = !!lockPeriods && lockPeriods.gtn(0);

    return (
      <>
        <Modal.Header>
          {t('Add Delegation')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={accountId}
            isDisabled
            label={t('delegator account')}
          />
          <InputAddress
            className='medium'
            help={t('The delegee account can vote on behalf of the delegator account')}
            label={t('delegee account')}
            onChange={this.onChangeDelegate}
            value={delegateId}
          />
          <InputNumber
            autoFocus
            className='medium'
            help={t('The number of lock periods for delegation')}
            isError={!hasValue}
            label={t('lock periods')}
            onChange={this.onChangeValue}
          />
        </Modal.Content>
      </>
    );
  }

  private onChangeDelegate = (delegateId: string) => {
    this.setState({ delegateId });
  }

  private onChangeValue = (lockPeriods?: BN) => {
    this.setState({ lockPeriods });
  }
}

export default translate(Delegate);
