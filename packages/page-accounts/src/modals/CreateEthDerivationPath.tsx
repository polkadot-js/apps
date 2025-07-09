// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from 'react';
import type { BN } from '@polkadot/util';
import type { DeriveValidationOutput } from '../types.js';

import React, { useEffect, useRef, useState } from 'react';

import { Checkbox, Dropdown, Input, InputNumber, MarkError, MarkWarning, Modal } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  onChange: (string: string) => void;
  seedType: string;
  derivePath: string;
  deriveValidation: DeriveValidationOutput | undefined;
  seed: string;
}

export const ETH_DEFAULT_PATH = "m/44'/60'/0'/0/0";

function CreateEthDerivationPath ({ className, derivePath, deriveValidation, onChange, seedType }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [addIndex, setAddIndex] = useState(0);
  const [customIndex, setCustomIndex] = useState<BN | undefined>(BN_ZERO);
  const [addressList] = useState<{ key: number; text: ReactNode; value: number; }[]>(
    () => new Array(10)
      .fill(0)
      .map((_, i) => ({
        key: i,
        text: t('Address index {{index}}', {
          replace: { index: i }
        }),
        value: i
      }))
  );
  const [useCustomPath, toggleCustomPath] = useToggle();
  const [useCustomIndex, toggleCustomIndex] = useToggle();

  const errorIndex = useRef<Record<string, string>>({
    INVALID_DERIVATION_PATH: t('This is an invalid derivation path.'),
    PASSWORD_IGNORED: t('Password are ignored for hex seed'),
    SOFT_NOT_ALLOWED: t('Soft derivation paths are not allowed on ed25519'),
    WARNING_SLASH_PASSWORD: t('Your password contains at least one "/" character. Disregard this warning if it is intended.')
  });

  useEffect((): void => {
    onChange(`m/44'/60'/0'/0/${useCustomIndex ? Number(customIndex) : addIndex}`);
  }, [customIndex, onChange, useCustomIndex, addIndex]);

  return (
    <Modal.Columns
      className={className}
      hint={
        seedType === 'raw'
          ? t('The derivation path is only relevant when deriving keys from a mnemonic.')
          : t('The derivation path allows you to create different accounts from the same base mnemonic.')
      }
    >
      {seedType === 'bip'
        ? (
          <>
            <div className='saveToggle'>
              <Checkbox
                label={<>{t('Use custom address index')}</>}
                onChange={toggleCustomIndex}
                value={useCustomIndex}
              />
            </div>
            {useCustomIndex
              ? (
                <InputNumber
                  isDecimal={false}
                  label={t('Custom index')}
                  onChange={setCustomIndex}
                  value={customIndex}
                />
              )
              : (
                <Dropdown
                  label={t('address index')}
                  onChange={setAddIndex}
                  options={addressList}
                  value={addIndex}
                />
              )}
            <div className='saveToggle'>
              <Checkbox
                label={<>{t('Use custom derivation path')}</>}
                onChange={toggleCustomPath}
                value={useCustomPath}
              />
            </div>
            {useCustomPath
              ? (
                <Input
                  isError={!!deriveValidation?.error}
                  label={t('secret derivation path')}
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
          <MarkWarning content={t('The derivation path is only relevant when deriving keys from a mnemonic.')} />
        )}
      {deriveValidation?.error && (
        <MarkError content={errorIndex.current[deriveValidation.error] || deriveValidation.error} />
      )}
      {deriveValidation?.warning && <MarkWarning content={errorIndex.current[deriveValidation.warning]} />}
    </Modal.Columns>
  );
}

export default React.memo(CreateEthDerivationPath);
