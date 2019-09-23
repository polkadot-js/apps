/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, StakingLedger } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { Option } from '@polkadot/types';
import { AddressInfo, Button, InputAddress, InputBalance, Modal, TxButton, TxComponent } from '@polkadot/react-components';
import { withCalls, withApi, withMulti } from '@polkadot/react-api';

import translate from '../../translate';

interface Props extends I18nProps, ApiProps {
  controllerId?: AccountId | null;
  isOpen: boolean;
  onClose: () => void;
  stashId: string;
  staking_ledger?: Option<StakingLedger>;
}

interface State {
  maxBalance?: BN;
  maxUnbond?: BN;
}

const BalanceWrapper = styled.div`
  & > div {
    justify-content: flex-end;

    & .column {
      flex: 0;
    }
  }
`;

class Unbond extends TxComponent<Props, State> {
  public state: State = {};

  public componentDidUpdate (prevProps: Props): void {
    const { staking_ledger } = this.props;

    if (staking_ledger !== prevProps.staking_ledger) {
      this.setMaxBalance();
    }
  }

  public render (): React.ReactNode {
    const { controllerId, isOpen, onClose, t } = this.props;
    const { maxUnbond } = this.state;
    const canSubmit = !!maxUnbond && maxUnbond.gtn(0);

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Unbond'
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
              icon='cancel'
            />
            <Button.Or />
            <TxButton
              accountId={controllerId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Unbond')}
              icon='sign-out'
              onClick={onClose}
              params={[maxUnbond]}
              tx='staking.unbond'
              ref={this.button}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent (): React.ReactNode {
    const { controllerId, stashId, t } = this.props;
    const { maxBalance } = this.state;

    return (
      <>
        <Modal.Header>
          {t('Unbond funds')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={controllerId}
            isDisabled
            label={t('controller account')}
          />
          <BalanceWrapper>
            <AddressInfo
              accountId={stashId}
              withBalance={{
                bonded: true
              }}
            />
          </BalanceWrapper>
          <InputBalance
            autoFocus
            className='medium'
            help={t('The amount of funds to unbond, this is adjusted using the bonded funds on the stash account.')}
            label={t('unbond amount')}
            maxValue={maxBalance}
            onChange={this.onChangeValue}
            onEnter={this.sendTx}
            withMax
          />
        </Modal.Content>
      </>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { maxUnbond = prevState.maxUnbond, maxBalance = prevState.maxBalance } = newState;

      return {
        maxUnbond,
        maxBalance
      };
    });
  }

  private setMaxBalance = (): void => {
    const { staking_ledger } = this.props;

    if (!staking_ledger || staking_ledger.isNone) {
      return;
    }

    const { active } = staking_ledger.unwrap();

    this.nextState({
      maxBalance: active.unwrap()
    });
  }

  private onChangeValue = (maxUnbond?: BN): void => {
    this.nextState({ maxUnbond });
  }
}

export default withMulti(
  Unbond,
  translate,
  withApi,
  withCalls<Props>(
    ['query.staking.ledger', { paramName: 'controllerId' }]
  )
);
