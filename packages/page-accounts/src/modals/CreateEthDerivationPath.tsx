// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { Checkbox, Dropdown, Input, InputNumber, MarkError, MarkWarning, Modal } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import { DeriveValidationOutput, PairType } from '../types';

interface Props {
  className?: string;
  onChange: (string: string) => void;
  seedType: string;
  derivePath: string;
  deriveValidation: DeriveValidationOutput | undefined;
  seed: string;
  addressFromSeed: (seed: string, derivePath: string, pairType: PairType) => string;
}

export const ETH_DEFAULT_PATH = "m/44'/60'/0'/0/0";

function CreateEthDerivationPath ({ addressFromSeed,
  className,
  derivePath,
  deriveValidation,
  onChange,
  seed,
  seedType }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [addIndex, setAddIndex] = useState(0);
  const [customIndex, setCustomIndex] = useState(new BN(0));
  const [addressList, setAddressList] = useState<{ key: number; text: ReactNode; value: number; }[]>([{
    key: 0,
    text: t('Address index 0'),
    value: 0
  }]);
  const [useCustomPath, toggleCustomPath] = useToggle();
  const [useCustomIndex, toggleCustomIndex] = useToggle();

  const errorIndex = useRef<Record<string, string>>({
    INVALID_DERIVATION_PATH: t<string>('This is an invalid derivation path.'),
    PASSWORD_IGNORED: t<string>('Password are ignored for hex seed'),
    SOFT_NOT_ALLOWED: t<string>('Soft derivation paths are not allowed on ed25519'),
    WARNING_SLASH_PASSWORD: t<string>('Your password contains at least one "/" character. Disregard this warning if it is intended.')
  });

  useEffect((): void => {
    onChange(`m/44'/60'/0'/0/${useCustomIndex ? Number(customIndex) : addIndex}`);
  }, [customIndex, onChange, useCustomIndex, addIndex]);

  useEffect((): void => {
    const list = new Array(5).fill(0).map((_, i) => ({
      key: i,
      text: t('Address index {{index}} - {{address}}', {
        replace: { address: addressFromSeed(seed, `m/44'/60'/0'/0/${i}`, 'ethereum'), index: i }
      }),
      value: i
    }));

    setAddressList(list);
  }, [seed, setAddressList, addressFromSeed, t]);

  return (
    <Modal.Columns
      className={className}
      hint={
        seedType === 'raw'
          ? t<string>('The derivation path is only relevant when deriving keys from a mnemonic.')
          : t<string>('The derivation path allows you to create different accounts from the same base mnemonic.')
      }
    >
      {seedType === 'bip'
        ? (
          <>
            <div className='saveToggle'>
              <Checkbox
                label={<>{t<string>('Use custom address index')}</>}
                onChange={toggleCustomIndex}
                value={useCustomIndex}
              />
            </div>
            {useCustomIndex
              ? (
                <InputNumber
                  help={t<string>('You can set a custom derivation index for this account')}
                  isDecimal={false}
                  label={t<string>('Custom index')}
                  onChange={setCustomIndex}
                  value={customIndex}
                />
              )
              : (
                <Dropdown
                  help={t('The address index (derivation on account) to use')}
                  label={t('address index')}
                  onChange={setAddIndex}
                  options={addressList}
                  value={addIndex}
                />
              )}
            <div className='saveToggle'>
              <Checkbox
                label={<>{t<string>('Use custom derivation path')}</>}
                onChange={toggleCustomPath}
                value={useCustomPath}
              />
            </div>
            {useCustomPath
              ? (
                <Input
                  help={t<string>(
                    'You can set a custom derivation path for this account using the following syntax "m/<purpose>/<coin_type>/<account>/<change>/<address_index>'
                  )}
                  isError={!!deriveValidation?.error}
                  label={t<string>('secret derivation path')}
                  onChange={onChange}
                  placeholder={ETH_DEFAULT_PATH}
                  tabIndex={-1}
                  value={derivePath}
                />
              )
              : null}
          </>
        )
        : (
          <MarkWarning content={t<string>('The derivation path is only relevant when deriving keys from a mnemonic.')} />
        )}

      {deriveValidation?.error && (
        <MarkError content={errorIndex.current[deriveValidation.error] || deriveValidation.error} />
      )}
      {deriveValidation?.warning && <MarkWarning content={errorIndex.current[deriveValidation.warning]} />}
    </Modal.Columns>
  );
}

export default React.memo(CreateEthDerivationPath);
