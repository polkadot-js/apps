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
  bondedId: string | null,
  isOpen: boolean,
  onClose: () => void
};

type State = {
  bondValue?: BN,
  controllerId: string | null,
  destination: number,
  isValidController: boolean
};

const stashOptions = [
  { text: 'Stash account (increase the amount at stake)', value: 0 },
  { text: 'Stash account (do not increase the amount at stake)', value: 1 },
  { text: 'Controller account', value: 2 }
];

class Bond extends React.PureComponent<Props, State> {
  state: State = {
    controllerId: null,
    destination: 0,
    isValidController: false
  };

  render () {
    const { accountId, isOpen, onClose, t } = this.props;
    const { bondValue, controllerId, destination, isValidController } = this.state;
    const canSubmit = isValidController && !!bondValue && bondValue.gtn(0) && controllerId;

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
    const { accountId, bondedId, t } = this.props;
    const { controllerId, destination, isValidController } = this.state;

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
            defaultValue={bondedId}
            help={t('The controller is the account that will be used to control any nominating or validating actions')}
            label={t('controller account')}
            onChange={this.onChangeController}
            value={controllerId}
          />
          {
            isValidController
              ? null
              : (
                <article className='error'>{t('Select a controller account which is not the same as you stash account. Controllers are responsible for making any actions to contol the bonded funds.')}</article>
              )
          }
          <InputBalance
            autoFocus
            className='medium'
            help={t('The total amount of the stash balance that will be at stake in any forthcoming rounds (should be less than the total amount available)')}
            label={t('value bonded')}
            onChange={this.onChangeValue}
          />
          <Dropdown
            className='medium'
            defaultValue={0}
            help={t('The destination account for any payments as either a nominator or validator')}
            label={t('payment destination')}
            onChange={this.onChangeDestination}
            options={stashOptions}
            value={destination}
          />
        </Modal.Content>
      </>
    );
  }

  private onChangeController = (controllerId: string) => {
    const { accountId } = this.props;

    this.setState({
      controllerId,
      isValidController: controllerId !== accountId
    });
  }

  private onChangeDestination = (destination: number) => {
    this.setState({ destination });
  }

  private onChangeValue = (bondValue?: BN) => {
    this.setState({ bondValue });
  }
}

export default translate(Bond);
