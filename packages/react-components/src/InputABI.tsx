// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { FileState } from '@polkadot/react-hooks/types';

import React from 'react';
import styled from 'styled-components';
import { Abi } from '@polkadot/api-contract';

import InputFile from './InputFile';
import Messages from './Messages';
import { useTranslation } from './translate';

interface Props extends BareProps {
  contractAbi?: Abi | null;
  errorText?: string | null;
  file: FileState | null;
  isContract?: boolean;
  isError?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isValid?: boolean;
  isSupplied?: boolean;
  label?: React.ReactNode;
  onRemove?: () => void;
  onRemoved?: () => void;
  onSelect?: () => void;
  onSelectConstructor?: (constructorIndex?: number) => void;
  setFile: React.Dispatch<FileState | null>;
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

function InputABI (props: Props): React.ReactElement<Props> {
  const { className, contractAbi, errorText, file, isContract = false, isDisabled, isError, isSupplied, isValid, setFile, withLabel } = props;
  const { t } = useTranslation();

  const help = isContract
    ? t('The ABI for the WASM code. Since we will be making a call into the code, the ABI is required and stored for future operations such as sending messages.')
    : t('The ABI for the WASM code. In this step it is optional, but setting it here simplifies the setup of contract instances.');
  const label = isContract
    ? 'Upload ABI'
    : 'Upload ABI (optional)';

  return (
    <InputFile
      className={className}
      errorText={t<string>(
        'Invalid ABI file — {{errorText}}',
        { replace: { errorText } }
      )}
      help={help}
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      onChange={setFile}
      value={file}
      withLabel={withLabel}
    >
      {(contractAbi && isValid) ? renderMessages(props) : null}
    </InputFile>
  );
}

export default React.memo(
  styled(InputABI)`
    min-height: 4rem;
  `
);
