// Copyright 2017-2021 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Abi } from '@polkadot/api-contract';
import { IconLink, InputFile, Labelled } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Messages from './Messages';

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
  onChange: (u8a: Uint8Array, name: string) => void;
  onRemove?: () => void;
  onRemoved?: () => void;
  onSelect?: () => void;
  onSelectConstructor?: (index?: number) => void;
  withConstructors?: boolean;
  withLabel?: boolean;
  withMessages?: boolean;
  withWasm?: boolean;
}

const NOOP = (): void => undefined;

function ABI ({ className, contractAbi, errorText, isDisabled, isError, isFull, isValid, label, onChange, onRemove = NOOP, onSelectConstructor, withConstructors = true, withLabel = true, withMessages = true, withWasm }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (contractAbi && isValid)
    ? (
      <Labelled
        className={className}
        help={t<string>('This is the ABI as supplied. Any calls to the contract will use this information for encoding.')}
        label={label || t<string>('contract ABI')}
        labelExtra={onRemove && (
          <IconLink
            icon='trash'
            label={t<string>('Remove ABI')}
            onClick={onRemove}
          />
        )}
        withLabel={withLabel}
      >
        <Messages
          contractAbi={contractAbi}
          isLabelled={withLabel}
          onSelectConstructor={onSelectConstructor}
          withConstructors={withConstructors}
          withMessages={withMessages}
          withWasm={withWasm}
        />
      </Labelled>
    )
    : (
      <div className={className}>
        <InputFile
          help={t<string>('The ABI for the WASM code. The ABI is required and stored for future operations such as sending messages.')}
          isDisabled={isDisabled}
          isError={isError}
          isFull={isFull}
          label={label || t<string>('contract ABI')}
          onChange={onChange}
          placeholder={errorText || t<string>('click to select or drag and drop a JSON file')}
        />
      </div>
    );
}

export default React.memo(ABI);
