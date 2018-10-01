// Copyright 2017-2018 @polkadot/app-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { SectionItem } from '@polkadot/params/types';
import { Interfaces } from '@polkadot/jsonrpc/types';
import { RawParam } from '@polkadot/ui-app/Params/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$MessageAdd } from '@polkadot/ui-signer/types';

import './index.css';

import BN from 'bn.js';
import React from 'react';
import rpc from '@polkadot/jsonrpc';
import Button from '@polkadot/ui-app/Button';
import InputRpc from '@polkadot/ui-app/InputRpc';
import Params from '@polkadot/ui-app/Params';
import rawToValues from '@polkadot/ui-signer/rawToValues';
import addressDecode from '@polkadot/util-keyring/address/decode';

import Account from './Account';
import translate from './translate';

type Props = I18nProps & {
  queueAdd: QueueTx$MessageAdd
};

type State = {
  isValid: boolean,
  nonce: BN,
  accountId: string | null,
  rpc: SectionItem<Interfaces>,
  values: Array<RawParam>
};

const defaultMethod = rpc.author.public.submitExtrinsic;

class Selection extends React.PureComponent<Props, State> {
  state: State = {
    isValid: false,
    nonce: new BN(0),
    accountId: null,
    rpc: defaultMethod,
    values: []
  };

  render () {
    const { t } = this.props;
    const { isValid, rpc } = this.state;

    return (
      <section className='rpc--Selection'>
        <InputRpc
          defaultValue={defaultMethod}
          onChange={this.onChangeMethod}
        />
        {this.renderAccount()}
        <Params
          item={rpc}
          onChange={this.onChangeValues}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onSubmit}
            text={t('submit', {
              defaultValue: 'Submit RPC call'
            })}
          />
        </Button.Group>
      </section>
    );
  }

  renderAccount () {
    const { rpc: { isSigned = false }, accountId } = this.state;

    if (!isSigned || !accountId) {
      return null;
    }

    return (
      <Account
        defaultValue={accountId}
        onChange={this.onChangeAccount}
      />
    );
  }

  nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { rpc = prevState.rpc, nonce = prevState.nonce, accountId = prevState.accountId, values = prevState.values } = newState;
        const hasNeededKey = rpc.isSigned !== true || (!!accountId && !!prevState.accountId && addressDecode(prevState.accountId).length === 32);
        const isValid = values.reduce((isValid, value) => {
          return isValid && value.isValid === true;
        }, rpc.params.length === values.length && hasNeededKey);

        return {
          isValid,
          rpc,
          nonce: nonce || new BN(0),
          accountId,
          values
        };
      }
    );
  }

  onChangeAccount = (accountId: string | undefined | null, nonce: BN): void => {
    this.nextState({
      nonce,
      accountId
    } as State);
  }

  onChangeMethod = (rpc: SectionItem<Interfaces>): void => {
    this.nextState({
      rpc,
      values: [] as Array<RawParam>
    } as State);
  }

  onChangeValues = (values: Array<RawParam>): void => {
    this.nextState({ values } as State);
  }

  onSubmit = (): void => {
    const { queueAdd } = this.props;
    const { isValid, nonce, accountId, rpc, values } = this.state;

    queueAdd({
      isValid,
      nonce,
      accountId,
      rpc,
      values: rawToValues(values)
    });
  }
}

export default translate(Selection);
