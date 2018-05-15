// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps as Props } from '@polkadot/ui-app/types';
import type { KeyringPair } from '@polkadot/util-keyring/types';

import React from 'react';

import Button from '@polkadot/ui-app/src/Button';
import Input from '@polkadot/ui-app/src/Input';
import InputAddress from '@polkadot/ui-app/src/InputAddress';
import Output from '@polkadot/ui-app/src/Output';
import Static from '@polkadot/ui-app/src/Static';
import classes from '@polkadot/ui-app/src/util/classes';
import keyring from '@polkadot/ui-keyring/src';
import hexToU8a from '@polkadot/util/hex/toU8a';
import isHex from '@polkadot/util/is/hex';
import u8aFromString from '@polkadot/util/u8a/fromString';
import u8aToHex from '@polkadot/util/u8a/toHex';

import Unlock from './Unlock';
import translate from './translate';

type State = {
  currentPair: KeyringPair | null,
  defaultPublicKey?: Uint8Array,
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
      defaultPublicKey: currentPair
        ? currentPair.publicKey()
        : void 0,
      data: '',
      isHexData: false,
      isLocked: currentPair
        ? !currentPair.hasSecretKey()
        : false,
      isUnlockVisible: false,
      signature: ''
    };
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { currentPair, data, defaultPublicKey, isHexData, isLocked, isUnlockVisible, signature } = this.state;

    return (
      <div
        className={classes('toolbox--Sign', className)}
        style={style}
      >
        <div className='ui--row'>
          <InputAddress
            className='full'
            defaultValue={defaultPublicKey}
            isInput={false}
            label={t('sign.account', {
              defaultValue: 'using my account'
            })}
            onChange={this.onChangeAccount}
            type='account'
          />
        </div>
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
        <Unlock
          isVisible={isUnlockVisible}
          onClose={this.toggleUnlock}
          pair={currentPair}
        />
        {
          isLocked
            ? (
              <Button.Group>
                <Button
                  isPrimary
                  onClick={this.toggleUnlock}
                  text={t('sign.unlock', {
                    defaultValue: 'Unlock account'
                  })}
                />
              </Button.Group>
            )
            : null
        }
      </div>
    );
  }

  nextState = (newState: $Shape<State>): void => {
    this.setState(
      (prevState: State): $Shape<State> => {
        const { currentPair = prevState.currentPair, data = prevState.data, isHexData = prevState.isHexData, isUnlockVisible = prevState.isUnlockVisible } = newState;
        const isLocked = !currentPair || !currentPair.hasSecretKey();
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
    });
  }

  onChangeAccount = (publicKey: Uint8Array): void => {
    const currentPair = keyring.getPair(publicKey);

    this.nextState({ currentPair });
  }

  onChangeData = (data: string): void => {
    const isHexData = isHex(data);

    this.nextState({ data, isHexData });
  }

  onUnlock = (): void => {
  }
}

export default translate(Sign);
