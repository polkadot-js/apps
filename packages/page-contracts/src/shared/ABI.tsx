// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Abi } from '@polkadot/api-contract';
import { InputFile, Labelled } from '@polkadot/react-components';

import Messages from './Messages';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  contractAbi?: Abi | null;
  errorText?: string | null;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isRequired?: boolean;
  isValid?: boolean;
  isSupplied?: boolean;
  label?: React.ReactNode;
  onChange: (u8a: Uint8Array) => void;
  onRemove?: () => void;
  onRemoved?: () => void;
  onSelect?: () => void;
  onSelectConstructor?: (constructorIndex?: number) => void;
  withConstructors?: boolean;
  withLabel?: boolean;
  withMessages?: boolean;
}

function renderMessages ({ contractAbi, onRemove, onSelectConstructor, withConstructors = true, withLabel, withMessages = true }: Props): React.ReactNode {
  return (
    <Messages
      contractAbi={contractAbi}
      isLabelled={withLabel}
      onRemove={onRemove}
      onSelectConstructor={onSelectConstructor}
      withConstructors={withConstructors}
      withMessages={withMessages}
    />
  );
}

function ABI (props: Props): React.ReactElement<Props> {
  const { className, contractAbi, errorText, isDisabled, isError, isFull, isValid, onChange, withLabel } = props;
  const { t } = useTranslation();

  const help = t('The ABI for the WASM code. The ABI is required and stored for future operations such as sending messages.');
  const label = t('contract ABI');

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
              isFull={isFull}
              label={label}
              onChange={onChange}
              placeholder={errorText || t<string>('click to select or drag and drop a JSON ABI file')}
            />
          )
      }
    </div>
  );
}

export default React.memo(ABI);
