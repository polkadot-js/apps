// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { CalculateBalanceProps } from '../../types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { AddressInfo, Button, InputAddress, InputBalanceBonded, Modal, TxButton, TxComponent } from '@polkadot/ui-app';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { withApi, withMulti } from '@polkadot/ui-api';

import translate from '../../translate';

type Props = I18nProps & ApiProps & CalculateBalanceProps & {
  stashId: string,
  controllerId: string,
  currentlyBonded: BN,
  isOpen: boolean,
  onClose: () => void
};

type State = {
  extrinsic: SubmittableExtrinsic | null,
  extrinsicProp?: 'staking.unbond' | 'staking.bondExtra'
  newBond: BN
};

const BalanceWrapper = styled.div`
  > div {
    justify-content: flex-end;
  }

  .column {
    grid-auto-columns: max-content;
    flex: 0;
  }
`;

const ZERO = new BN(0);

class BondEdit extends TxComponent<Props, State> {
  state: State = {
    extrinsic: null,
    newBond: ZERO
  };

  render () {
    const { controllerId, isOpen, onClose, stashId, t } = this.props;
    const { extrinsic, extrinsicProp } = this.state;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--BondEdit'
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
              accountId={extrinsicProp && extrinsicProp === 'staking.unbond'
                ? controllerId
                : stashId}
              isPrimary
              label={t('Submit')}
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
    const { extrinsicProp } = this.state;
    const { controllerId, currentlyBonded, stashId, t } = this.props;

    return (
      <>
        <Modal.Header>
          {t('Edit bonded funds')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <div className='modal-Text'>
          {t('Select the amount of funds that your stash will bond. You will then sign a transaction to add or remove funds according to the currently bonded funds with your stash account (to bond more funds) or your controller account (to unbond funds).')}
          </div>
          <InputAddress
            className='medium'
            defaultValue={stashId}
            isDisabled
            label={t('stash account')}
          />
          <BalanceWrapper>
            <AddressInfo
              withBalance={{
                available: true,
                bonded: true,
                free: false,
                redeemable: false,
                unlocking: false
              }}
              value={stashId}
            />
          </BalanceWrapper>
          <InputBalanceBonded
            autoFocus
            className='medium'
            controllerId={controllerId}
            defaultValue={currentlyBonded}
            extrinsicProp={extrinsicProp}
            help={t('The new amount you wish to bond. Should you choose to bond a lower amount of funds than what is currently bonded, these funds will be redeemable past the unbonding period.')}
            label={t('new bonded amount')}
            onChange={this.onChangeValue}
            onEnter={this.sendTx}
            stashId={stashId}
            withMax
          />
        </Modal.Content>
      </>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api, currentlyBonded } = this.props;
      const { newBond = prevState.newBond, extrinsic = prevState.extrinsic, extrinsicProp = prevState.extrinsicProp } = newState;

      if (!newBond || !currentlyBonded) {
        return {
          extrinsic,
          extrinsicProp,
          newBond
        };
      }

      const bondingDiff = newBond.sub(currentlyBonded);
      let newExtrinsicProp = extrinsicProp;
      let newExtrinsic = extrinsic;

      if (bondingDiff.gtn(0)) {
        newExtrinsicProp = 'staking.bondExtra';
        newExtrinsic = api.tx.staking.bondExtra(bondingDiff);
      } else if (bondingDiff.ltn(0)) {
        newExtrinsicProp = 'staking.unbond';
        newExtrinsic = api.tx.staking.unbond(bondingDiff.abs());
      }

      return {
        newBond,
        extrinsic: newExtrinsic,
        extrinsicProp: newExtrinsicProp
      };
    });
  }

  private onChangeValue = (newBond?: BN) => {
    this.nextState({ newBond });
  }

}

export default withMulti(
  BondEdit,
  translate,
  withApi
);
