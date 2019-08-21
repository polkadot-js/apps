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
import { withCalls, withMulti } from '@polkadot/react-api';
import { Text } from '@polkadot/types';

import translate from '../translate';
import InputValidationController from './Account/InputValidationController';
import { rewardDestinationOptions } from './constants';

interface Props extends ApiProps, I18nProps, CalculateBalanceProps {
  onClose: () => void;
  systemChain?: Text;
}

interface State {
  bondValue?: BN;
  controllerError: string | null;
  controllerId: string | null;
  destination: number;
  extrinsic: SubmittableExtrinsic | null;
  ignoreController: boolean;
  stashId: string | null;
}

const NO_VALIDATION_CHAINS = ['Development', 'Kusama'];

class NewStake extends TxComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      controllerError: null,
      controllerId: null,
      destination: 0,
      extrinsic: null,
      ignoreController: false,
      stashId: null
    };
  }

  public static getDerivedStateFromProps ({ systemChain }: Props): Pick<State, any> | null {
    if (!systemChain) {
      return null;
    }

    return {
      ignoreController: NO_VALIDATION_CHAINS.includes(systemChain.toString())
    };
  }

  public render (): React.ReactNode {
    const { onClose, t } = this.props;
    const { bondValue, controllerError, controllerId, extrinsic, ignoreController, stashId } = this.state;
    const hasValue = !!bondValue && bondValue.gtn(0);
    const canSubmit = (hasValue && (ignoreController || (!controllerError && !!controllerId)));

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

  private renderContent (): React.ReactNode {
    const { t } = this.props;
    const { controllerId, controllerError, bondValue, destination, ignoreController, stashId } = this.state;
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
            isError={!ignoreController && !!controllerError}
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
      const { bondValue = prevState.bondValue, controllerError = prevState.controllerError, controllerId = prevState.controllerId, destination = prevState.destination, ignoreController = prevState.ignoreController, stashId = prevState.stashId } = newState;
      const extrinsic = (bondValue && controllerId)
        ? api.tx.staking.bond(controllerId, bondValue, destination)
        : null;

      return {
        bondValue,
        controllerError,
        controllerId,
        destination,
        extrinsic,
        ignoreController,
        stashId
      };
    });
  }

  private onChangeController = (controllerId: string): void => {
    this.nextState({ controllerId });
  }

  private onChangeDestination = (destination: number): void => {
    this.nextState({ destination });
  }

  private onChangeStash = (stashId: string): void => {
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
  withCalls<Props>(
    ['rpc.system.chain', { propName: 'systemChain' }]
  )
);
