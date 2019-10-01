// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { KeyringPair } from '@polkadot/keyring/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withMulti } from '@polkadot/react-api';
import { Button, Input, InputAddress, Output, Static } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import { hexToU8a, isHex, stringToU8a, u8aToHex } from '@polkadot/util';

import translate from './translate';
import Unlock from './Unlock';

interface Props extends I18nProps {
  className?: string;
}

interface State {
  currentPair: KeyringPair | null;
  data: string;
  isHexData: boolean;
  isLocked: boolean;
  isUnlockVisible: boolean;
  signature: string;
}

function Sign ({ className, t }: Props): React.ReactElement<Props> {
  const [state, setState] = useState<State>({
    currentPair: null,
    data: '',
    isHexData: false,
    isLocked: false,
    isUnlockVisible: false,
    signature: ''
  });

  useEffect((): void => {
    const pairs = keyring.getPairs();
    const currentPair = pairs[0] || null;

    setState({
      currentPair,
      data: '',
      isHexData: false,
      isLocked: currentPair
        ? currentPair.isLocked
        : false,
      isUnlockVisible: false,
      signature: ''
    });
  }, []);

  const _nextState = ({ currentPair = state.currentPair, data = state.data, isHexData = state.isHexData, isUnlockVisible = state.isUnlockVisible }: Partial<State>): void => {
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

    setState({
      currentPair,
      data,
      isHexData,
      isLocked,
      isUnlockVisible,
      signature
    });
  };

  const _toggleUnlock = (): void =>
    _nextState({ isUnlockVisible: !state.isUnlockVisible });
  const _onChangeAccount = (accountId: string | null): void =>
    _nextState({ currentPair: keyring.getPair(accountId || '') });
  const _onChangeData = (data: string): void =>
    _nextState({ data, isHexData: isHex(data) });

  const { currentPair, data, isHexData, isLocked, isUnlockVisible, signature } = state;

  return (
    <div className={`toolbox--Sign ${className}`}>
      <div className='ui--row'>
        <InputAddress
          className='full'
          help={t('select the account you wish to sign data with')}
          isInput={false}
          label={t('account')}
          onChange={_onChangeAccount}
          type='account'
        />
      </div>
      <div className='toolbox--Sign-input'>
        <div className='ui--row'>
          <Input
            autoFocus
            className='full'
            help={t('The input data to sign. This can be either specified as a hex value (0x-prefix) or as a string.')}
            label={t('sign the following data')}
            onChange={_onChangeData}
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
        <div
          className='unlock-overlay'
          hidden={!isLocked}
        >
          {isLocked && (
            <div className='unlock-overlay-warning'>
              <div className='unlock-overlay-content'>
                {t('You need to unlock this account to be able to sign data.')}<br/>
                <Button.Group>
                  <Button
                    isPrimary
                    onClick={_toggleUnlock}
                    label={t('Unlock account')}
                    icon='unlock'
                  />
                </Button.Group>
              </div>
            </div>
          )}
        </div>
        {isUnlockVisible && (
          <Unlock
            onClose={_toggleUnlock}
            pair={currentPair}
          />
        )}
      </div>
    </div>
  );
}

export default withMulti(
  styled(Sign)`
    .toolbox--Sign-input {
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
    }
  `,
  translate
);
