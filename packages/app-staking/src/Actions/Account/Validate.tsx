// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ValidatorPrefs } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { Button, InputAddress, InputBalance, InputNumber, Modal, TxButton, TxComponent } from '@polkadot/ui-app';

import InputValidationUnstakeThreshold from './InputValidationUnstakeThreshold';
import translate from '../../translate';

interface Props extends I18nProps {
  controllerId: string;
  isOpen: boolean;
  onClose: () => void;
  stashId: string;
  validatorPrefs?: ValidatorPrefs;
}

interface State {
  unstakeThreshold?: BN;
  unstakeThresholdError: string | null;
  validatorPayment?: BN;
}

class Validate extends TxComponent<Props, State> {
  public state: State = {
    unstakeThreshold: new BN(3),
    unstakeThresholdError: null,
    validatorPayment: new BN(0)
  };

  // inject the preferences returned via RPC once into the state (from this
  // point forward it will be entirely managed by the actual inputs)
  public static getDerivedStateFromProps (props: Props, state: State): State | null {
    if (state.unstakeThreshold && state.validatorPayment) {
      return null;
    }

    if (props.validatorPrefs) {
      const { unstakeThreshold, validatorPayment } = props.validatorPrefs;

      return {
        unstakeThreshold: unstakeThreshold.toBn(),
        unstakeThresholdError: null,
        validatorPayment: validatorPayment.toBn()
      };
    }

    return {
      unstakeThreshold: undefined,
      unstakeThresholdError: null,
      validatorPayment: undefined
    };
  }

  public render (): React.ReactNode {
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

  private renderButtons (): React.ReactNode {
    const { controllerId, onClose, t, validatorPrefs } = this.props;
    const { unstakeThreshold, unstakeThresholdError, validatorPayment } = this.state;
    const isChangingPrefs = validatorPrefs && !!validatorPrefs.unstakeThreshold;

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
            accountId={controllerId}
            isDisabled={!!unstakeThresholdError}
            isPrimary
            label={isChangingPrefs ? t('Set validator preferences') : t('Validate')}
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

  private renderContent (): React.ReactNode {
    const { controllerId, stashId, t, validatorPrefs } = this.props;
    const { unstakeThreshold, unstakeThresholdError, validatorPayment } = this.state;
    const defaultValue = validatorPrefs && validatorPrefs.unstakeThreshold && validatorPrefs.unstakeThreshold.toBn();

    return (
      <>
        <Modal.Header>
          {t('Set validator preferences')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={stashId.toString()}
            isDisabled
            label={t('stash account')}
          />
          <InputAddress
            className='medium'
            defaultValue={controllerId}
            isDisabled
            label={t('controller account')}
          />
          <InputNumber
            autoFocus
            bitLength={32}
            className='medium'
            defaultValue={defaultValue}
            help={t('The number of time this validator can get slashed before being automatically unstaked (maximum of 10 allowed)')}
            isError={!!unstakeThresholdError}
            label={t('automatic unstake threshold')}
            onChange={this.onChangeThreshold}
            onEnter={this.sendTx}
            value={
              unstakeThreshold
                ? unstakeThreshold.toString()
                : '3'
            }
          />
          <InputValidationUnstakeThreshold
            onError={this.onUnstakeThresholdError}
            unstakeThreshold={unstakeThreshold}
          />
          <InputBalance
            className='medium'
            defaultValue={validatorPrefs && validatorPrefs.validatorPayment && validatorPrefs.validatorPayment.toBn()}
            help={t('Amount taken up-front from the reward by the validator before spliting the remainder between themselves and the nominators')}
            label={t('reward commission')}
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

  private onChangePayment = (validatorPayment?: BN): void => {
    if (validatorPayment) {
      this.setState({ validatorPayment });
    }
  }

  private onChangeThreshold = (unstakeThreshold?: BN): void => {
    if (unstakeThreshold) {
      this.setState({ unstakeThreshold });
    }
  }

  private onUnstakeThresholdError = (unstakeThresholdError: string | null): void => {
    this.setState({ unstakeThresholdError });
  }
}

export default translate(Validate);
