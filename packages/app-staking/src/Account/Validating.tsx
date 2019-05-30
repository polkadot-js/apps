// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { ValidatorPrefs } from '@polkadot/types';
import { Button, InputAddress, InputBalance, InputNumber, Modal, TxButton, TxComponent } from '@polkadot/ui-app';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  isOpen: boolean,
  onClose: () => void,
  stashId: string,
  validatorPrefs: ValidatorPrefs
};

type State = {
  unstakeThreshold?: BN,
  validatorPayment?: BN
};

class Staking extends TxComponent<Props, State> {
  state: State = {
    unstakeThreshold: new BN(3),
    validatorPayment: new BN(0)
  };

  // inject the preferences are returned via RPC once into the state (from this
  // point forward it will be entirely managed by the actual inputs)
  static getDerivedStateFromProps (props: Props, state: State): State | null {
    if (state.unstakeThreshold) {
      return null;
    }

    const { unstakeThreshold, validatorPayment } = props.validatorPrefs;

    return {
      unstakeThreshold: unstakeThreshold.toBn(),
      validatorPayment: validatorPayment.toBn()
    };
  }

  render () {
    const { isOpen } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Staking'
        dimmer='inverted'
        open
        size='small'
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons () {
    const { accountId, onClose, t } = this.props;
    const { unstakeThreshold, validatorPayment } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            label={t('Cancel')}
            onClick={onClose}
          />
          <Button.Or />
          <TxButton
            accountId={accountId}
            isPrimary
            label={t('Validate')}
            onClick={onClose}
            params={[{
              unstakeThreshold,
              validatorPayment
            }]}
            tx='staking.validate'
            ref={this.button}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { accountId, stashId, t } = this.props;
    const { unstakeThreshold, validatorPayment } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Validating')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={accountId}
            isDisabled
            label={t('controller account')}
          />
          <InputAddress
            className='medium'
            defaultValue={stashId.toString()}
            isDisabled
            label={t('stash account')}
          />
          <InputNumber
            autoFocus
            bitLength={32}
            className='medium'
            help={t('The number of allowed slashes for this validator before being automatically unstaked (maximum of 10 allowed)')}
            label={t('unstake threshold')}
            onChange={this.onChangeThreshold}
            onEnter={this.sendTx}
            value={
              unstakeThreshold
                ? unstakeThreshold.toString()
                : '3'
            }
          />
          <InputBalance
            className='medium'
            help={t('Reward that validator takes up-front, the remainder is split between themselves and nominators')}
            label={t('payment preferences')}
            onChange={this.onChangePayment}
            onEnter={this.sendTx}
            value={
              validatorPayment
                ? validatorPayment.toString()
                : '0'
            }
          />
        </Modal.Content>
      </>
    );
  }

  private onChangePayment = (validatorPayment?: BN) => {
    if (validatorPayment) {
      this.setState({ validatorPayment });
    }
  }

  private onChangeThreshold = (unstakeThreshold?: BN) => {
    if (unstakeThreshold) {
      this.setState({ unstakeThreshold });
    }
  }
}

export default translate(Staking);
