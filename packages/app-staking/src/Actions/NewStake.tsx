// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { CalculateBalanceProps } from '../types';

import BN from 'bn.js';
import React from 'react';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { Button, Dropdown, InputAddress, InputBalanceBonded, Modal, TxButton, TxComponent } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';

import translate from '../translate';
import { rewardDestinationOptions } from './constants';
import InputValidationController from './Account/InputValidationController';

type Props = I18nProps & ApiProps & CalculateBalanceProps & {
  onClose: () => void;
};

interface State {
  bondValue?: BN;
  controllerError: string | null;
  controllerId: string | null;
  destination: number;
  extrinsic: SubmittableExtrinsic | null;
  stashId: string | null;
}

class NewStake extends TxComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      controllerError: null,
      controllerId: null,
      destination: 0,
      extrinsic: null,
      stashId: null
    };
  }

  public render (): React.ReactNode {
    const { onClose, t } = this.props;
    const { bondValue, controllerError, controllerId, extrinsic, stashId } = this.state;
    const hasValue = !!bondValue && bondValue.gtn(0);
    const canSubmit = hasValue && !controllerError && !!controllerId;

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
              accountId={stashId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Bond')}
              onClick={onClose}
              extrinsic={extrinsic}
              ref={this.button}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { t } = this.props;
    const { controllerId, controllerError, bondValue, destination, stashId } = this.state;
    const hasValue = !!bondValue && bondValue.gtn(0);

    return (
      <>
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
            isError={!!controllerError}
            label={t('controller account')}
            onChange={this.onChangeController}
            type='account'
            value={controllerId}
          />
          <InputValidationController
            accountId={stashId}
            controllerId={controllerId}
            onError={this.onControllerError}
          />
          <InputBalanceBonded
            autoFocus
            className='medium'
            controllerId={controllerId}
            destination={destination}
            extrinsicProp={'staking.bond'}
            help={t('The total amount of the stash balance that will be at stake in any forthcoming rounds (should be less than the total amount available)')}
            isError={!hasValue}
            label={t('value bonded')}
            onChange={this.onChangeValue}
            onEnter={this.sendTx}
            stashId={stashId}
            withMax
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
      </>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { bondValue = prevState.bondValue, controllerError = prevState.controllerError, controllerId = prevState.controllerId, destination = prevState.destination, stashId = prevState.stashId } = newState;
      const extrinsic = (bondValue && controllerId)
        ? api.tx.staking.bond(controllerId, bondValue, destination)
        : null;

      return {
        bondValue,
        controllerError,
        controllerId,
        destination,
        extrinsic,
        stashId
      };
    });
  }

  private onChangeController = (controllerId: string) => {
    this.nextState({ controllerId });
  }

  private onChangeDestination = (destination: number) => {
    this.nextState({ destination });
  }

  private onChangeStash = (stashId: string) => {
    this.nextState({ stashId });
  }

  private onChangeValue = (bondValue?: BN) => {
    this.nextState({ bondValue });
  }

  private onControllerError = (controllerError: string | null) => {
    this.setState({ controllerError });
  }
}

export default withMulti(
  NewStake,
  translate,
  withApi
);
