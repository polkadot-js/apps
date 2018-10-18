// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$ExtrinsicAdd } from '@polkadot/ui-signer/types';

import React from 'react';
import Api from '@polkadot/api-observable';
import { Extrinsic } from '@polkadot/types';
import { Button } from '@polkadot/ui-app/index';

import Account from './Account';
import ExtrinsicDisplay from './Extrinsic';
import Nonce from './Nonce';
import translate from './translate';

type Props = I18nProps & {
  queueExtrinsic: QueueTx$ExtrinsicAdd
};

type State = {
  isValid: boolean,
  extrinsic: Extrinsic | null,
  accountNonce: BN,
  accountId: string
};

class Selection extends React.PureComponent<Props, State> {
  state: State = {
    isValid: false
  } as State;

  render () {
    const { t } = this.props;
    const { isValid, accountId } = this.state;

    return (
      <div className='extrinsics--Selection'>
        <Account
          isInput={false}
          label={t('display.sender', {
            defaultValue: 'using the selected account'
          })}
          onChange={this.onChangeSender}
          type='account'
        />
        <ExtrinsicDisplay
          defaultValue={Api.extrinsics.balances.transfer}
          labelMethod={t('display.method', {
            defaultValue: 'submit the following extrinsic'
          })}
          onChange={this.onChangeExtrinsic}
        />
        <Nonce
          label={t('display.nonce', {
            defaultValue: 'with an index'
          })}
          rxChange={this.onChangeNonce}
          value={accountId}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onQueue}
            text={t('submit.label', {
              defaultValue: 'Submit Transaction'
            })}
          />
        </Button.Group>
      </div>
    );
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { extrinsic = prevState.extrinsic, accountNonce = prevState.accountNonce, accountId = prevState.accountId } = newState;
        const isValid = !!(
          accountId &&
          accountId.length &&
          extrinsic
        );

        return {
          extrinsic,
          isValid,
          accountNonce,
          accountId
        };
      }
    );
  }

  private onChangeExtrinsic = (extrinsic: Extrinsic | null = null): void => {
    this.nextState({ extrinsic } as State);
  }

  private onChangeNonce = (accountNonce: BN = new BN(0)): void => {
    this.nextState({ accountNonce } as State);
  }

  onChangeSender = (accountId: string): void => {
    this.nextState({ accountId, accountNonce: new BN(0) } as State);
  }

  private onQueue = (): void => {
    const { queueExtrinsic } = this.props;
    const { accountNonce, extrinsic, isValid, accountId } = this.state;

    if (!isValid || !extrinsic) {
      return;
    }

    queueExtrinsic({
      accountNonce,
      extrinsic,
      accountId
    });
  }
}

export default translate(Selection);
