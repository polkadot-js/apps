// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';
import { KeypairType } from '@polkadot/util-crypto/types';

import React, { useEffect, useState } from 'react';
import { Dropdown, Icon, Input, InputAddress, Static } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { isHex } from '@polkadot/util';
import { naclVerify, schnorrkelVerify } from '@polkadot/util-crypto';
import styled from 'styled-components';

import translate from './translate';

type CryptoTypes = KeypairType | 'unknown';

const AlignedIcon = styled(Icon)`
  &&&::before {
    position: relative;
    left: 0.88rem;
    top: 1rem;
    width: 32px;
    height: 32px;
    font-size: 32px;
    background: white !important;
    border-radius: 50%;
  }

  &&&.big.icon {
    font-size: 32px;
  }
`;

function Verify ({ t }: Props): React.ReactElement<Props> {
  const [{ cryptoType, isValid }, setValidity] = useState<{ cryptoType: CryptoTypes; isValid: boolean }>({ cryptoType: 'unknown', isValid: false });
  const [{ data, isHexData }, setData] = useState<{ data: string; isHexData: boolean }>({ data: '', isHexData: false });
  const [{ publicKey, isValidPk }, setPublicKey] = useState<{ publicKey: Uint8Array | null; isValidPk: boolean }>({ publicKey: null, isValidPk: false });
  const [{ signature, isValidSignature }, setSignature] = useState<{ signature: string; isValidSignature: boolean }>({ signature: '', isValidSignature: false });
  const [cryptoOptions] = useState([{ value: 'unknown', text: t('Crypto not detected') }].concat(uiSettings.availableCryptos as any[]));

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

  const _onChangeAddress = (accountId: string | null): void => {
    let publicKey: Uint8Array | null = null;

    try {
      publicKey = keyring.decodeAddress(accountId || '');
    } catch (err) {
      console.error(err);
    }

    setPublicKey({ publicKey, isValidPk: !!publicKey && publicKey.length === 32 });
  };

  const _onChangeData = (data: string): void =>
    setData({ data, isHexData: isHex(data) });

  const _onChangeSignature = (signature: string): void =>
    setSignature({ signature, isValidSignature: isHex(signature) && signature.length === 130 });

  return (
    <div className='toolbox--Verify'>
      <div className='ui--row'>
        <InputAddress
          className='full'
          help={t('The account that signed the input')}
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
          help={t('The data that was signed. This is used in combination with the signature for the verification. It can either be hex or a string.')}
          label={t('using the following data')}
          onChange={_onChangeData}
          value={data}
        />
      </div>
      <div className='ui--row'>
        <div className="ui--AlignedIconContainer" style={{ position: 'absolute', zIndex: 1 }}>
          <AlignedIcon
            color={isValid ? 'green' : (isValidSignature ? 'red' : undefined)}
            name={isValid ? 'check circle' : (isValidSignature ? 'exclamation circle' : 'help circle')}
            size="big"
          />
        </div>
        <Input
          className='full'
          isError={!isValidSignature}
          help={t('The signature as by the account being checked, supplied as a hex-formatted string.')}
          label={t('the supplied signature')}
          onChange={_onChangeSignature}
          value={signature}
        />
      </div>
      <div className='ui--row'>
        <Dropdown
          defaultValue={cryptoType}
          help={t('Cryptography used to create this signature. It is auto-detected on valid signatures.')}
          isDisabled
          label={t('signature crypto type')}
          options={cryptoOptions}
        />
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
    </div>
  );
}

export default translate(Verify);
