// Copyright 2017-2018 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/ui-app/types';
import { KeyringPair } from '@polkadot/util-keyring/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Input from '@polkadot/ui-app/Input';
import InputAddress from '@polkadot/ui-app/InputAddress';
import Output from '@polkadot/ui-app/Output';
import Static from '@polkadot/ui-app/Static';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';
import hexToU8a from '@polkadot/util/hex/toU8a';
import isHex from '@polkadot/util/is/hex';
import u8aFromString from '@polkadot/util/u8a/fromString';
import u8aToHex from '@polkadot/util/u8a/toHex';

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
    const { className, style } = this.props;

    return (
      <div
        className={classes('toolbox--Sign', className)}
        style={style}
      >
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
          label={t('sign.account', {
            defaultValue: 'using my account'
          })}
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
          text={t('sign.unlock', {
            defaultValue: 'Unlock account'
          })}
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
          className='large'
          label={t('sign.data', {
            defaultValue: 'sign the following data (hex or string)'
          })}
          onChange={this.onChangeData}
          value={data}
        />
        <Static
          className='small'
          label={t('sign.isHex', {
            defaultValue: 'hex input data'
          })}
          value={
            isHexData
              ? t('sign.isHex.yes', {
                defaultValue: 'Yes'
              })
              : t('sign.isHex.no', {
                defaultValue: 'No'
              })
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
          label={t('sign.signed', {
            defaultValue: 'signature of supplied data'
          })}
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
                : u8aFromString(data)
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

  onChangeAccount = (publicKey: Uint8Array): void => {
    const currentPair = keyring.getPair(publicKey);

    this.nextState({ currentPair } as State);
  }

  onChangeData = (data: string): void => {
    const isHexData = isHex(data);

    this.nextState({ data, isHexData } as State);
  }
}

export default translate(Sign);
