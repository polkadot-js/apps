// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { CalculateBalanceProps } from '../types';

import BN from 'bn.js';
import React from 'react';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { Button, Dropdown, InputAddress, InputBalanceBonded, Modal, TxButton, TxComponent } from '@polkadot/react-components';
import { withApi, withMulti } from '@polkadot/react-api';

import translate from '../translate';
import detectUnsafe from '../unsafeChains';
import InputValidateAmount from './Account/InputValidateAmount';
import InputValidationController from './Account/InputValidationController';
import { rewardDestinationOptions } from './constants';

interface Props extends ApiProps, I18nProps, CalculateBalanceProps {
  onClose: () => void;
}

interface State {
  amountError: string | null;
  bondValue?: BN;
  controllerError: string | null;
  controllerId: string | null;
  destination: number;
  extrinsic: SubmittableExtrinsic | null;
  stashId: string | null;
}

class NewStake extends TxComponent<Props, State> {
  public state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      amountError: null,
      controllerError: null,
      controllerId: null,
      destination: 0,
      extrinsic: null,
      stashId: null
    };
  }

  public render (): React.ReactNode {
    const { onClose, systemChain, t } = this.props;
    const { amountError, bondValue, controllerError, controllerId, destination, extrinsic, stashId } = this.state;
    const hasValue = !!bondValue && bondValue.gtn(0);
    const isUnsafeChain = detectUnsafe(systemChain);
    const canSubmit = (hasValue && (isUnsafeChain || (!controllerError && !!controllerId)));

    return (
      <Modal
        className='staking--Bonding'
        dimmer='inverted'
        open
        size='small'
      >
        <Modal.Header>
          {t('Bonding Preferences')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            label={t('stash account')}
            onChange={this.onChangeStash}
            type='account'
            value={stashId}
          />
          <InputAddress
            className='medium'
            help={t('The controller is the account that will be used to control any nominating or validating actions. Should not match another stash or controller.')}
            isError={!isUnsafeChain && !!controllerError}
            label={t('controller account')}
            onChange={this.onChangeController}
            type='account'
            value={controllerId}
          />
          <InputValidationController
            accountId={stashId}
            controllerId={controllerId}
            isUnsafeChain={isUnsafeChain}
            onError={this.onControllerError}
          />
          <InputBalanceBonded
            autoFocus
            className='medium'
            controllerId={controllerId}
            destination={destination}
            extrinsicProp={'staking.bond'}
            help={t('The total amount of the stash balance that will be at stake in any forthcoming rounds (should be less than the total amount available)')}
            isError={!hasValue || !!amountError}
            label={t('value bonded')}
            onChange={this.onChangeValue}
            onEnter={this.sendTx}
            stashId={stashId}
            withMax={!isUnsafeChain}
          />
          <InputValidateAmount
            accountId={stashId}
            onError={this.onAmountError}
            value={bondValue}
          />
          <Dropdown
            className='medium'
            defaultValue={0}
            help={t('The destination account for any payments as either a nominator or validator')}
            label={t('payment destination')}
            onChange={this.onChangeDestination}
            options={rewardDestinationOptions}
            value={destination}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button
              isNegative
              onClick={onClose}
              label={t('Cancel')}
              icon='cancel'
            />
            <Button.Or />
            <TxButton
              accountId={stashId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Bond')}
              icon='sign-in'
              onClick={onClose}
              extrinsic={extrinsic}
              ref={this.button}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { amountError = prevState.amountError, bondValue = prevState.bondValue, controllerError = prevState.controllerError, controllerId = prevState.controllerId, destination = prevState.destination, stashId = prevState.stashId } = newState;
      const extrinsic = (bondValue && controllerId)
        ? api.tx.staking.bond(controllerId, bondValue, destination)
        : null;

      return {
        amountError,
        bondValue,
        controllerError,
        controllerId,
        destination,
        extrinsic,
        stashId
      };
    });
  }

  private onAmountError = (amountError: string | null): void => {
    this.nextState({ amountError });
  }

  private onChangeController = (controllerId: string | null): void => {
    this.nextState({ controllerId });
  }

  private onChangeDestination = (destination: number): void => {
    this.nextState({ destination });
  }

  private onChangeStash = (stashId: string | null): void => {
    this.nextState({ stashId });
  }

  private onChangeValue = (bondValue?: BN): void => {
    this.nextState({ bondValue });
  }

  private onControllerError = (controllerError: string | null): void => {
    this.setState({ controllerError });
  }
}

export default withMulti(
  NewStake,
  translate,
  withApi
);
