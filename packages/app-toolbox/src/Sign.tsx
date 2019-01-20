// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/ui-app/types';
import { KeyringPair } from '@polkadot/keyring/types';

import React from 'react';
import { Button , Input, InputAddress, Output, Static } from '@polkadot/ui-app/index';
import keyring from '@polkadot/ui-keyring';
import { hexToU8a, isHex, stringToU8a, u8aToHex } from '@polkadot/util';

import Unlock from './Unlock';
import translate from './translate';

type State = {
  currentPair: KeyringPair | null,
  defaultValue?: string,
  data: string,
  isHexData: boolean,
  isLocked: boolean,
  isUnlockVisible: boolean,
  signature: string
};

class Sign extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const pairs = keyring.getPairs();
    const currentPair = pairs[0] || null;

    this.state = {
      currentPair,
      defaultValue: currentPair
        ? currentPair.address()
        : void 0,
      data: '',
      isHexData: false,
      isLocked: currentPair
        ? currentPair.isLocked()
        : false,
      isUnlockVisible: false,
      signature: ''
    };
  }

  render () {
    return (
      <div className='toolbox--Sign'>
        {this.renderAccount()}
        {this.renderInput()}
        {this.renderSignature()}
        {this.renderUnlock()}
        {this.renderButtons()}
      </div>
    );
  }

  renderAccount () {
    const { t } = this.props;
    const { defaultValue } = this.state;

    return (
      <div className='ui--row'>
        <InputAddress
          className='full'
          defaultValue={defaultValue}
          isInput={false}
          label={t('using my account')}
          onChange={this.onChangeAccount}
          type='account'
        />
      </div>
    );
  }

  renderButtons () {
    const { t } = this.props;
    const { isLocked } = this.state;

    if (!isLocked) {
      return null;
    }

    return (
      <Button.Group>
        <Button
          isPrimary
          onClick={this.toggleUnlock}
          text={t('Unlock account')}
        />
      </Button.Group>
    );
  }

  renderInput () {
    const { t } = this.props;
    const { data, isHexData } = this.state;

    return (
      <div className='ui--row'>
        <Input
          autoFocus
          className='large'
          label={t('sign the following data (hex or string)')}
          onChange={this.onChangeData}
          value={data}
        />
        <Static
          className='small'
          label={t('hex input data')}
          value={
            isHexData
              ? t('Yes')
              : t('No')
          }
        />
      </div>
    );
  }

  renderSignature () {
    const { t } = this.props;
    const { signature } = this.state;

    return (
      <div className='ui--row'>
        <Output
          className='full toolbox--hex'
          isHidden={signature.length === 0}
          label={t('signature of supplied data')}
          value={signature}
          withCopy
        />
      </div>
    );
  }

  renderUnlock () {
    const { currentPair, isUnlockVisible } = this.state;

    if (!isUnlockVisible) {
      return null;
    }

    return (
      <Unlock
        onClose={this.toggleUnlock}
        pair={currentPair}
      />
    );
  }

  nextState = (newState: State): void => {
    this.setState(
      (prevState: State): State => {
        const { currentPair = prevState.currentPair, data = prevState.data, isHexData = prevState.isHexData, isUnlockVisible = prevState.isUnlockVisible } = newState;
        const isLocked = !currentPair || currentPair.isLocked();
        let signature = '';

        if (!isLocked && currentPair) {
          signature = u8aToHex(
            currentPair.sign(
              isHexData
                ? hexToU8a(data)
                : stringToU8a(data)
            )
          );
        }

        return {
          currentPair,
          data,
          isHexData,
          isLocked,
          isUnlockVisible,
          signature
        };
      }
    );
  }

  toggleUnlock = (): void => {
    const { isUnlockVisible } = this.state;

    this.nextState({
      isUnlockVisible: !isUnlockVisible
    } as State);
  }

  onChangeAccount = (accountId: string): void => {
    const currentPair = keyring.getPair(accountId);

    this.nextState({ currentPair } as State);
  }

  onChangeData = (data: string): void => {
    const isHexData = isHex(data);

    this.nextState({ data, isHexData } as State);
  }
}

export default translate(Sign);
