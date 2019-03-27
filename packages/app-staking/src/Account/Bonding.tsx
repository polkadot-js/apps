// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { Button, InputAddress, InputBalance, Modal, TxButton, Dropdown } from '@polkadot/ui-app';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  sessionId: string,
  isOpen: boolean,
  onClose: () => void
};

type State = {
  bondValue?: BN,
  controllerId: string | null,
  destination: number
};

const stashOptions = [
  { text: 'Stash account (increase the amount at stake)', value: 0 },
  { text: 'Stash account (do not increase the amount at stake)', value: 1 },
  { text: 'Controller account', value: 2 }
];

class Bonding extends React.PureComponent<Props, State> {
  state: State = {
    controllerId: null,
    destination: 0
  };

  render () {
    const { accountId, isOpen, onClose, t } = this.props;
    const { bondValue, controllerId, destination } = this.state;
    const canSubmit = !!bondValue && bondValue.gtn(0) && controllerId;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Bonding'
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
            params={[controllerId, bondValue, destination]}
            tx='staking.bond'
          />
        </Button.Group>
      </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { accountId, sessionId, t } = this.props;
    const { controllerId } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Bonding Preferences')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={accountId}
            isDisabled
            label={t('stash account')}
          />
          <InputAddress
            className='medium'
            defaultValue={sessionId}
            label={t('controller account')}
            onChange={this.onChangeController}
            value={controllerId}
          />
          <InputBalance
            autoFocus
            className='medium'
            label={t('value bonded')}
            onChange={this.onChangeValue}
          />
          <Dropdown
            className='medium'
            defaultValue={0}
            label={t('payment destination')}
            onChange={this.onChangeDestination}
            options={stashOptions}
          />
        </Modal.Content>
      </>
    );
  }

  private onChangeController = (controllerId: string) => {
    this.setState({ controllerId });
  }

  private onChangeDestination = (destination: number) => {
    this.setState({ destination });
  }

  private onChangeValue = (bondValue?: BN) => {
    this.setState({ bondValue });
  }
}

export default translate(Bonding);
