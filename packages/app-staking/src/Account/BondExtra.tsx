// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/ui-app';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  isOpen: boolean,
  onClose: () => void
};

type State = {
  maxAdditional?: BN
};

class BondExtra extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { accountId, isOpen, onClose, t } = this.props;
    const { maxAdditional } = this.state;
    const canSubmit = !!maxAdditional && maxAdditional.gtn(0);

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--BondExtra'
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
              label={t('Bond')}
              onClick={onClose}
              params={[maxAdditional]}
              tx='staking.bondExtra'
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { accountId, t } = this.props;

    return (
      <>
        <Modal.Header>
          {t('Bond Extra')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={accountId}
            isDisabled
            label={t('stash account')}
          />
          <InputBalance
            autoFocus
            className='medium'
            help={t('The maximum amount to increase the bonded value, this is adjusted using the available free funds on the account.')}
            label={t('max additional value')}
            onChange={this.onChangeValue}
          />
        </Modal.Content>
      </>
    );
  }

  private onChangeValue = (maxAdditional?: BN) => {
    this.setState({ maxAdditional });
  }
}

export default translate(BondExtra);
