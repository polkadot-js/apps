// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { Abi } from '@polkadot/api-contract';
import { InputFile, Labelled } from '@polkadot/react-components';

import Messages from './Messages';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  contractAbi?: Abi | null;
  errorText?: string | null;
  isContract?: boolean;
  isError?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isValid?: boolean;
  isSupplied?: boolean;
  label?: React.ReactNode;
  onChange: (u8a: Uint8Array) => void;
  onRemove?: () => void;
  onRemoved?: () => void;
  onSelect?: () => void;
  onSelectConstructor?: (constructorIndex?: number) => void;
  withLabel?: boolean;
}

function renderMessages ({ contractAbi, isDisabled, onRemove, onSelectConstructor, withLabel }: Props): React.ReactNode {
  return (
    <Messages
      contractAbi={contractAbi}
      isLabelled={withLabel}
      isRemovable={!isDisabled}
      onRemove={onRemove}
      onSelectConstructor={onSelectConstructor}
      withConstructors
    />
  );
}

function ABI (props: Props): React.ReactElement<Props> {
  const { className, contractAbi, errorText, isContract = false, isDisabled, isError, isSupplied, isValid, onChange, withLabel } = props;
  const { t } = useTranslation();

  const help = isContract
    ? t('The ABI for the WASM code. Since we will be making a call into the code, the ABI is required and stored for future operations such as sending messages.')
    : t('The ABI for the WASM code. In this step it is optional, but setting it here simplifies the setup of contract instances.');
  const label = isContract
    ? 'contract ABI'
    : 'contract ABI (optional)';

  return (
    <div className={className}>
      {
        (contractAbi && isValid)
          ? (
            withLabel
              ? (
                <Labelled
                  help={help}
                  label={label}
                >
                  {renderMessages(props)}
                </Labelled>
              )
              : renderMessages(props)
          )
          : (
            <InputFile
              help={help}
              isDisabled={isDisabled}
              isError={isError}
              label={label}
              onChange={onChange}
              placeholder={
                isSupplied && !isValid
                  ? (
                    <>
                      {t<string>('invalid ABI file selected')}
                      {!!errorText && (
                        <>
                          {' — '}
                          {t<string>(errorText)}
                        </>
                      )}
                    </>
                  )
                  : t<string>('click to select or drag and drop a JSON ABI file')
              }
            />
          )
      }
    </div>
  );
}

export default React.memo(
  styled(ABI)`
    min-height: 4rem;
  `
);
