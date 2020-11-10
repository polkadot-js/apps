// Copyright 2017-2020 @polkadot/app-signing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeypairType } from '@polkadot/util-crypto/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Badge, Dropdown, Input, InputAddress, Static } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { isHex } from '@polkadot/util';
import { naclVerify, schnorrkelVerify } from '@polkadot/util-crypto';

import { useTranslation } from './translate';

type CryptoTypes = KeypairType | 'unknown';

interface Props {
  className?: string;
}

function Verify ({ className = '' }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [{ cryptoType, isValid }, setValidity] = useState<{ cryptoType: CryptoTypes; isValid: boolean }>({ cryptoType: 'unknown', isValid: false });
  const [{ data, isHexData }, setData] = useState<{ data: string; isHexData: boolean }>({ data: '', isHexData: false });
  const [{ isValidPk, publicKey }, setPublicKey] = useState<{ isValidPk: boolean; publicKey: Uint8Array | null }>({ isValidPk: false, publicKey: null });
  const [{ isValidSignature, signature }, setSignature] = useState<{ isValidSignature: boolean; signature: string }>({ isValidSignature: false, signature: '' });
  const [cryptoOptions] = useState([{ text: t<string>('Crypto not detected'), value: 'unknown' }].concat(uiSettings.availableCryptos as any[]));

  useEffect((): void => {
    let cryptoType: CryptoTypes = 'unknown';
    let isValid = isValidPk && isValidSignature;

    // We cannot just use the keyring verify since it may be an address. So here we first check
    // for ed25519, if not valid, we try against sr25519 - if neither are valid, well, we have
    // not been able to validate the signature
    if (isValid && publicKey) {
      let isValidSr = false;
      let isValidEd = false;

      try {
        isValidEd = naclVerify(data, signature, publicKey);
      } catch (error) {
        // do nothing, already set to false
      }

      if (isValidEd) {
        cryptoType = 'ed25519';
      } else {
        try {
          isValidSr = schnorrkelVerify(data, signature, publicKey);
        } catch (error) {
          // do nothing, already set to false
        }

        if (isValidSr) {
          cryptoType = 'sr25519';
        } else {
          isValid = false;
        }
      }
    }

    setValidity({ cryptoType, isValid });
  }, [data, isValidPk, isValidSignature, publicKey, signature]);

  const _onChangeAddress = useCallback(
    (accountId: string | null): void => {
      let publicKey: Uint8Array | null = null;

      try {
        publicKey = keyring.decodeAddress(accountId || '');
      } catch (err) {
        console.error(err);
      }

      setPublicKey({ isValidPk: !!publicKey && publicKey.length === 32, publicKey });
    },
    []
  );

  const _onChangeData = useCallback(
    (data: string) => setData({ data, isHexData: isHex(data) }),
    []
  );

  const _onChangeSignature = useCallback(
    (signature: string) => setSignature({ isValidSignature: isHex(signature) && signature.length === 130, signature }),
    []
  );

  return (
    <div className={`toolbox--Verify ${className}`}>
      <div className='ui--row'>
        <InputAddress
          className='full'
          help={t<string>('The account that signed the input')}
          isError={!isValidPk}
          isInput
          label={t<string>('verify using address')}
          onChange={_onChangeAddress}
        />
      </div>
      <div className='ui--row'>
        <Input
          autoFocus
          className='full'
          help={t<string>('The data that was signed. This is used in combination with the signature for the verification. It can either be hex or a string.')}
          label={t<string>('using the following data')}
          onChange={_onChangeData}
          value={data}
        />
      </div>
      <div className='ui--row'>
        <div className='ui--AlignedIconContainer'>
          <Badge
            className='alignedBadge'
            color={isValid ? 'green' : (isValidSignature ? 'red' : 'gray')}
            icon={isValid ? 'check' : (isValidSignature ? 'exclamation' : 'question')}
          />
        </div>
        <Input
          className='full'
          help={t<string>('The signature as by the account being checked, supplied as a hex-formatted string.')}
          isError={!isValidSignature}
          label={t<string>('the supplied signature')}
          onChange={_onChangeSignature}
          value={signature}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          defaultValue={cryptoType}
          help={t<string>('Cryptography used to create this signature. It is auto-detected on valid signatures.')}
          isDisabled
          label={t<string>('signature crypto type')}
          options={cryptoOptions}
        />
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
    </div>
  );
}

export default React.memo(styled(Verify)`
  .ui--AlignedIconContainer {
    position: absolute;
    z-index: 1;
  }

  .alignedBadge {
    left: 1.25rem;
    position: relative;
    top: 1.25rem;
  }
`);
