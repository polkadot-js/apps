// Copyright 2017-2025 @polkadot/app-signing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeypairType } from '@polkadot/util-crypto/types';

import React, { useCallback, useEffect, useState } from 'react';

import { Badge, Dropdown, Input, InputAddress, Static, styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { settings } from '@polkadot/ui-settings';
import { isHex } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';

import { useTranslation } from './translate.js';

type CryptoTypes = KeypairType | 'unknown';

interface Props {
  className?: string;
}

function Verify ({ className = '' }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { isEthereum } = useApi();
  const [{ cryptoType, isValid }, setValidity] = useState<{ cryptoType: CryptoTypes; isValid: boolean }>({ cryptoType: 'unknown', isValid: false });
  const [{ data, isHexData }, setData] = useState<{ data: string; isHexData: boolean }>({ data: '', isHexData: false });
  const [{ isValidPk, publicKey }, setPublicKey] = useState<{ isValidPk: boolean; publicKey: Uint8Array | null }>({ isValidPk: false, publicKey: null });
  const [{ isValidSignature, signature }, setSignature] = useState<{ isValidSignature: boolean; signature: string }>({ isValidSignature: false, signature: '' });
  const [cryptoOptions] = useState([{ text: t('Crypto not detected'), value: 'unknown' }].concat(settings.availableCryptos as { text: string; value: string }[]));

  useEffect((): void => {
    let cryptoType: CryptoTypes = 'unknown';
    let isValid = isValidPk && isValidSignature;

    // We use signatureVerify to detect validity and crypto type
    if (isValid && publicKey) {
      const verification = signatureVerify(data, signature, publicKey);

      if (verification.crypto !== 'none') {
        cryptoType = verification.crypto;
        isValid = verification.isValid;
      } else {
        isValid = false;
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

      setPublicKey({ isValidPk: !!publicKey && (publicKey.length === 32 || (isEthereum && publicKey.length === 20)), publicKey });
    },
    [isEthereum]
  );

  const _onChangeData = useCallback(
    (data: string) => setData({ data, isHexData: isHex(data) }),
    []
  );

  const _onChangeSignature = useCallback(
    (signature: string) => setSignature({ isValidSignature: isHex(signature) && (signature.length === 130 || (isEthereum && signature.length === 132)), signature }),
    [isEthereum]
  );

  return (
    <StyledDiv className={`${className} toolbox--Verify`}>
      <div className='ui--row'>
        <InputAddress
          className='full'
          isError={!isValidPk}
          isInput
          label={t('verify using address')}
          onChange={_onChangeAddress}
        />
      </div>
      <div className='ui--row'>
        <Input
          autoFocus
          className='full'
          label={t('using the following data')}
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
          isError={!isValidSignature}
          label={t('the supplied signature')}
          onChange={_onChangeSignature}
          value={signature}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          defaultValue={cryptoType}
          isDisabled
          label={t('signature crypto type')}
          options={cryptoOptions}
        />
        <Static
          className='medium'
          label={t('hex input data')}
          value={
            isHexData
              ? t('Yes')
              : t('No')
          }
        />
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .ui--AlignedIconContainer {
    position: absolute;
    z-index: 1;
  }

  .alignedBadge {
    left: 1.25rem;
    position: relative;
    top: 1.25rem;
  }
`;

export default React.memo(Verify);
