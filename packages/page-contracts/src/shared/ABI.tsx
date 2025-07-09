// Copyright 2017-2025 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Abi } from '@polkadot/api-contract';

import React from 'react';

import { IconLink, InputFile, Labelled } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Messages from './Messages.js';

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
        label={label || t('contract ABI')}
        labelExtra={onRemove && (
          <IconLink
            icon='trash'
            label={t('Remove ABI')}
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
          isDisabled={isDisabled}
          isError={isError}
          isFull={isFull}
          label={label || t('contract ABI')}
          onChange={onChange}
          placeholder={errorText || t('click to select or drag and drop a JSON file')}
        />
      </div>
    );
}

export default React.memo(ABI);
