// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ValidatorPrefs, ValidatorPrefs0to145 } from '@polkadot/types/interfaces';
import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { withApi, withMulti } from '@polkadot/react-api';
import { Button, InputAddress, InputBalance, InputNumber, Modal, TxButton, TxComponent } from '@polkadot/react-components';

import InputValidationUnstakeThreshold from './InputValidationUnstakeThreshold';
import translate from '../../translate';

interface Props extends ApiProps, I18nProps {
  controllerId: string;
  isOpen: boolean;
  onClose: () => void;
  stashId: string;
  validatorPrefs?: ValidatorPrefs | ValidatorPrefs0to145;
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
  public static getDerivedStateFromProps ({ isSubstrateV2, validatorPrefs }: Props, state: State): Pick<State, never> | null {
    if (state.unstakeThreshold && state.validatorPayment) {
      return null;
    }

    if (validatorPrefs) {
      // 1.x, it has both values
      if (isSubstrateV2) {
        const { validatorPayment } = validatorPrefs as ValidatorPrefs;

        return {
          validatorPayment: validatorPayment.toBn()
        };
      } else {
        const { unstakeThreshold, validatorPayment } = validatorPrefs as ValidatorPrefs0to145;

        return {
          unstakeThreshold: unstakeThreshold.toBn(),
          unstakeThresholdError: null,
          validatorPayment: validatorPayment.toBn()
        };
      }
    }

    return null;
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
    const { controllerId, isSubstrateV2, onClose, t } = this.props;
    const { unstakeThreshold, unstakeThresholdError, validatorPayment } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            label={t('Cancel')}
            icon='cancel'
            onClick={onClose}
          />
          <Button.Or />
          <TxButton
            accountId={controllerId}
            isDisabled={!!unstakeThresholdError}
            isPrimary
            label={t('Validate')}
            icon='check circle outline'
            onClick={onClose}
            params={[
              isSubstrateV2
                ? { validatorPayment }
                : { unstakeThreshold, validatorPayment }
            ]}
            tx='staking.validate'
            ref={this.button}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent (): React.ReactNode {
    const { controllerId, isSubstrateV2, stashId, t, validatorPrefs } = this.props;
    const { unstakeThreshold, unstakeThresholdError, validatorPayment } = this.state;
    const defaultThreshold = validatorPrefs && (validatorPrefs as ValidatorPrefs0to145).unstakeThreshold && (validatorPrefs as ValidatorPrefs0to145).unstakeThreshold.toBn();

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
          {!isSubstrateV2 && (
            <>
              <InputNumber
                autoFocus
                bitLength={32}
                className='medium'
                defaultValue={defaultThreshold}
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
            </>
          )}
          <InputBalance
            className='medium'
            defaultValue={validatorPrefs && validatorPrefs.validatorPayment && validatorPrefs.validatorPayment.toBn()}
            help={t('Amount taken up-front from the reward by the validator before splitting the remainder between themselves and the nominators')}
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

export default withMulti(
  Validate,
  translate,
  withApi
);
