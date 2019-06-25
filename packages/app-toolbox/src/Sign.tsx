// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button , Input, InputAddress, Output, Static } from '@polkadot/ui-app';
import { I18nProps as Props } from '@polkadot/ui-app/types';
import keyring from '@polkadot/ui-keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { hexToU8a, isHex, stringToU8a, u8aToHex } from '@polkadot/util';
import React from 'react';

import styled from 'styled-components';
import translate from './translate';
import Unlock from './Unlock';

type State = {
  className?: string,
  currentPair: KeyringPair | null,
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
      data: '',
      isHexData: false,
      isLocked: currentPair
        ? currentPair.isLocked
        : false,
      isUnlockVisible: false,
      signature: ''
    };
  }

  render () {
    const { className, isLocked } = this.state;

    return (
      <div className='toolbox--Sign'>
        {this.renderAccount()}
        <div className={className}>
          {this.renderInput()}
          {this.renderSignature()}
          <div className='unlock-overlay' hidden={!isLocked}>
            {this.renderUnlockWarning()}
          </div>
          {this.renderUnlock()}
        </div>
      </div>
    );
  }

  renderAccount () {
    const { t } = this.props;

    return (
      <div className='ui--row'>
        <InputAddress
          className='full'
          help={t('select the account you wish to sign data with')}
          isInput={false}
          label={t('account')}
          onChange={this.onChangeAccount}
          type='account'
        />
      </div>
    );
  }

  renderUnlockWarning () {
    const { t } = this.props;
    const { isLocked } = this.state;

    if (!isLocked) {
      return null;
    }

    return (
      <div className='unlock-overlay-warning'>
        <div className='unlock-overlay-content'>
          {t('You need to unlock this account to be able to sign data.')}<br/>
          <Button.Group>
            <Button
              isPrimary
              onClick={this.toggleUnlock}
              label={t('Unlock account')}
            />
          </Button.Group>
        </div>
      </div>
    );
  }

  renderInput () {
    const { t } = this.props;
    const { data, isHexData } = this.state;

    return (
      <>
        <div className='ui--row'>
          <Input
            autoFocus
            className='full'
            help={t('The input data to sign. This can be either specified as a hex value (0x-prefix) or as a string.')}
            label={t('sign the following data')}
            onChange={this.onChangeData}
            value={data}
          />
        </div>
        <div className='ui--row'>
          <Static
            className='medium'
            help={t('Detection on the input string to determine if it is hex or non-hex.')}
            label={t('hex input data')}
            value={
              isHexData
                ? t('Yes')
                : t('No')
            }
          />
        </div>
      </>
    );
  }

  renderSignature () {
    const { t } = this.props;
    const { signature } = this.state;

    return (
      <div className='ui--row'>
        <Output
          className='full'
          help={t('The resulting signature of the input data, as done with the crypto algorithm from the account. (This could be non-deterministic for some types such as sr25519).')}
          isHidden={signature.length === 0}
          isMonospace
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
        const isLocked = !currentPair || currentPair.isLocked;
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

export default translate(styled(Sign)`
  position: relative;
  width: 100%;
  height: 100%;

  .unlock-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    background-color: #0f0e0e7a;
  }

 .unlock-overlay-warning {
    display: flex;
    align-items: center;
    justify-content: center;
    height:100%;
  }

  .unlock-overlay-content {
    color:#fff;
    text-align:center;

    .ui--Button-Group {
      text-align: center;
    }
  }
`);
