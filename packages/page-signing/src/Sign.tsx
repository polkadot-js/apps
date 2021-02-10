// Copyright 2017-2021 @polkadot/app-signing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Signer } from '@polkadot/api/types';
import type { KeyringPair } from '@polkadot/keyring/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { web3FromSource } from '@polkadot/extension-dapp';
import { Button, Input, InputAddress, Output, Static } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { hexToU8a, isFunction, isHex, stringToHex, stringToU8a, u8aToHex } from '@polkadot/util';

import { useTranslation } from './translate';
import Unlock from './Unlock';

interface Props {
  className?: string;
}

interface AccountState {
  isExternal: boolean;
  isHardware: boolean;
  isInjected: boolean;
}

interface DataState {
  data: string;
  isHexData: boolean;
}

interface SignerState {
  isUsable: boolean;
  signer: Signer | null;
}

function Sign ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [currentPair, setCurrentPair] = useState<KeyringPair | null>(() => keyring.getPairs()[0] || null);
  const [{ data, isHexData }, setData] = useState<DataState>({ data: '', isHexData: false });
  const [{ isInjected }, setAccountState] = useState<AccountState>({ isExternal: false, isHardware: false, isInjected: false });
  const [isLocked, setIsLocked] = useState(false);
  const [{ isUsable, signer }, setSigner] = useState<SignerState>({ isUsable: true, signer: null });
  const [signature, setSignature] = useState('');
  const [isUnlockVisible, toggleUnlock] = useToggle();

  useEffect((): void => {
    const meta = (currentPair && currentPair.meta) || {};
    const isExternal = (meta.isExternal as boolean) || false;
    const isHardware = (meta.isHardware as boolean) || false;
    const isInjected = (meta.isInjected as boolean) || false;
    const isUsable = !(isExternal || isHardware || isInjected);

    setAccountState({ isExternal, isHardware, isInjected });
    setIsLocked(
      isInjected
        ? false
        : (currentPair && currentPair.isLocked) || false
    );
    setSignature('');
    setSigner({ isUsable, signer: null });

    // for injected, retrieve the signer
    if (meta.source && isInjected) {
      web3FromSource(meta.source as string)
        .catch((): null => null)
        .then((injected) => setSigner({
          isUsable: isFunction(injected?.signer?.signRaw),
          signer: injected?.signer || null
        }))
        .catch(console.error);
    }
  }, [currentPair]);

  const _onChangeAccount = useCallback(
    (accountId: string | null) => accountId && setCurrentPair(keyring.getPair(accountId)),
    []
  );

  const _onChangeData = useCallback(
    (data: string) => setData({ data, isHexData: isHex(data) }),
    []
  );

  const _onSign = useCallback(
    (): void => {
      if (isLocked || !isUsable || !currentPair) {
        return;
      }

      if (signer && isFunction(signer.signRaw)) {
        setSignature('');

        signer
          .signRaw({
            address: currentPair.address,
            data: isHexData
              ? data
              : stringToHex(data),
            type: 'bytes'
          })
          .then(({ signature }) => setSignature(signature))
          .catch(console.error);
      } else {
        setSignature(u8aToHex(
          currentPair.sign(
            isHexData
              ? hexToU8a(data)
              : stringToU8a(data)
          )
        ));
      }
    },
    [currentPair, data, isHexData, isLocked, isUsable, signer]
  );

  const _onUnlock = useCallback(
    (): void => {
      setIsLocked(false);
      toggleUnlock();
    },
    [toggleUnlock]
  );

  return (
    <div className={`toolbox--Sign ${className}`}>
      <div className='ui--row'>
        <InputAddress
          className='full'
          help={t<string>('select the account you wish to sign data with')}
          isInput={false}
          label={t<string>('account')}
          onChange={_onChangeAccount}
          type='account'
        />
      </div>
      <div className='toolbox--Sign-input'>
        <div className='ui--row'>
          <Input
            autoFocus
            className='full'
            help={t<string>('The input data to sign. This can be either specified as a hex value (0x-prefix) or as a string.')}
            label={t<string>('sign the following data')}
            onChange={_onChangeData}
            value={data}
          />
        </div>
        <div className='ui--row'>
          <Static
            className='medium'
            help={t<string>('Detection on the input string to determine if it is hex or non-hex.')}
            label={t<string>('hex input data')}
            value={
              isHexData
                ? t<string>('Yes')
                : t<string>('No')
            }
          />
        </div>
        <div className='ui--row'>
          <Output
            className='full'
            help={t<string>('The resulting signature of the input data, as done with the crypto algorithm from the account. (This could be non-deterministic for some types such as sr25519).')}
            isHidden={signature.length === 0}
            isMonospace
            label={t<string>('signature of supplied data')}
            value={signature}
            withCopy
          />
        </div>
        <div
          className='unlock-overlay'
          hidden={!isUsable || !isLocked || isInjected}
        >
          {isLocked && (
            <div className='unlock-overlay-warning'>
              <div className='unlock-overlay-content'>
                {t<string>('You need to unlock this account to be able to sign data.')}<br/>
                <Button.Group>
                  <Button
                    icon='unlock'
                    label={t<string>('Unlock account')}
                    onClick={toggleUnlock}
                  />
                </Button.Group>
              </div>
            </div>
          )}
        </div>
        <div
          className='unlock-overlay'
          hidden={isUsable}
        >
          <div className='unlock-overlay-warning'>
            <div className='unlock-overlay-content'>
              {isInjected
                ? t<string>('This injected account cannot be used to sign data since the extension does not support raw signing.')
                : t<string>('This external account cannot be used to sign data. Only Limited support is currently available for signing from any non-internal accounts.')}
            </div>
          </div>
        </div>
        {isUnlockVisible && (
          <Unlock
            onClose={toggleUnlock}
            onUnlock={_onUnlock}
            pair={currentPair}
          />
        )}
      </div>
      <Button.Group>
        <Button
          icon='key'
          isDisabled={!(isUsable && !isLocked)}
          label={t<string>('Sign message')}
          onClick={_onSign}
        />
      </Button.Group>
    </div>
  );
}

export default React.memo(styled(Sign)`
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
      padding: 0 2.5rem;
      text-align:center;

      .ui--Button-Group {
        text-align: center;
      }
    }
  }
`);
