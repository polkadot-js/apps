// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/ui-app';
import { I18nProps } from '@polkadot/ui-app/types';
import React from 'react';

import translate from '../translate';

type Props = I18nProps & {
  controllerId?: string | null,
  isOpen: boolean,
  onClose: () => void
};

type State = {
  maxUnbond?: BN
};

class Unbond extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { controllerId, isOpen, onClose, t } = this.props;
    const { maxUnbond } = this.state;
    const canSubmit = !!maxUnbond && maxUnbond.gtn(0);

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Unbond'
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
              accountId={controllerId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Unbond')}
              onClick={onClose}
              params={[maxUnbond]}
              tx='staking.unbond'
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { controllerId, t } = this.props;

    return (
      <>
        <Modal.Header>
          {t('Unbond')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={controllerId}
            isDisabled
            label={t('controler account')}
          />
          <InputBalance
            autoFocus
            className='medium'
            help={t('The maximum amount to unbond, this is adjusted using the bonded funds on the account.')}
            label={t('unbond amount')}
            onChange={this.onChangeValue}
          />
        </Modal.Content>
      </>
    );
  }

  private onChangeValue = (maxUnbond?: BN) => {
    this.setState({ maxUnbond });
  }
}

export default translate(Unbond);
